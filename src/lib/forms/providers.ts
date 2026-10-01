/**
 * Lead/mail providers.
 *
 * Only two exist: `disabled` (default everywhere) and `sandbox` (local, in-memory, for tests
 * and local review). No live provider is wired. Brevo is the proposed provider, pending
 * contract, region, consent export, retention and suppression decisions (launch gate G-FORMS).
 */

export class ProviderError extends Error {
  constructor(message = 'provider unavailable') {
    super(message);
    this.name = 'ProviderError';
  }
}

export interface EarlyAccessRequest {
  email: string;
  organization: string;
  role: string;
  useCase: string;
  locale: string;
}

export interface ContactMessage {
  email: string;
  message: string;
  locale: string;
}

export interface LeadProvider {
  readonly name: 'sandbox';
  /** Starts double opt-in. Must be idempotent and must not reveal whether the address is known. */
  subscribe(email: string, locale: string): Promise<void>;
  requestEarlyAccess(request: EarlyAccessRequest): Promise<void>;
  sendContact(message: ContactMessage): Promise<void>;
}

export type FormsMode = 'disabled' | 'sandbox';

/**
 * Any unknown or missing value means disabled. Sandbox is refused on Vercel production so that
 * a misconfiguration can never make production appear to accept submissions.
 */
export function resolveFormsMode(env: { FORMS_MODE?: string | undefined; VERCEL_ENV?: string | undefined }): FormsMode {
  if (env.FORMS_MODE === 'sandbox' && env.VERCEL_ENV !== 'production') return 'sandbox';
  return 'disabled';
}

// ---------------------------------------------------------------------------------------------
// Sandbox provider: models double opt-in, duplicates, unsubscribe/suppression and failures.
// Emails are never sent; an outbox records what would have been sent, for tests.
// ---------------------------------------------------------------------------------------------

type SubscriberState = 'pending' | 'confirmed';

interface Subscriber {
  state: SubscriberState;
  token: string;
  locale: string;
  consentAt: string;
  confirmedAt?: string;
}

export interface OutboxEntry {
  type: 'doi-confirmation' | 'early-access-received' | 'contact-notification';
  to: string;
  token?: string;
}

export class SandboxProvider implements LeadProvider {
  readonly name = 'sandbox' as const;
  readonly subscribers = new Map<string, Subscriber>();
  readonly suppressed = new Set<string>();
  readonly earlyAccess = new Map<string, EarlyAccessRequest>();
  readonly contacts: ContactMessage[] = [];
  readonly outbox: OutboxEntry[] = [];
  /** When true, every call fails — simulates a provider outage. */
  failing = false;

  private now: () => Date;
  private newToken: () => string;

  constructor(opts: { now?: () => Date; newToken?: () => string } = {}) {
    this.now = opts.now ?? (() => new Date());
    this.newToken = opts.newToken ?? (() => crypto.randomUUID());
  }

  private guard(): void {
    if (this.failing) throw new ProviderError();
  }

  private key(email: string): string {
    return email.trim().toLowerCase();
  }

  async subscribe(email: string, locale: string): Promise<void> {
    this.guard();
    const key = this.key(email);
    if (this.suppressed.has(key)) return; // Suppressed: never contact again, same response.
    const existing = this.subscribers.get(key);
    if (existing?.state === 'confirmed') return; // Already confirmed: nothing to send.
    if (existing?.state === 'pending') return; // Pending: do not resend (no mail bombing).
    const token = this.newToken();
    this.subscribers.set(key, { state: 'pending', token, locale, consentAt: this.now().toISOString() });
    this.outbox.push({ type: 'doi-confirmation', to: key, token });
  }

  async confirm(token: string): Promise<boolean> {
    this.guard();
    for (const [key, sub] of this.subscribers) {
      if (sub.token === token && sub.state === 'pending' && !this.suppressed.has(key)) {
        sub.state = 'confirmed';
        sub.confirmedAt = this.now().toISOString();
        return true;
      }
    }
    return false;
  }

  async unsubscribe(email: string): Promise<void> {
    this.guard();
    const key = this.key(email);
    this.subscribers.delete(key);
    this.suppressed.add(key);
  }

  async requestEarlyAccess(request: EarlyAccessRequest): Promise<void> {
    this.guard();
    const key = this.key(request.email);
    const isNew = !this.earlyAccess.has(key);
    this.earlyAccess.set(key, { ...request, email: key });
    if (isNew) this.outbox.push({ type: 'early-access-received', to: key });
  }

  async sendContact(message: ContactMessage): Promise<void> {
    this.guard();
    this.contacts.push({ ...message, email: this.key(message.email) });
    this.outbox.push({ type: 'contact-notification', to: 'sandbox-team' });
  }
}
