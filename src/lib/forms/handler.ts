import { safeLog } from '../log.ts';
import { ProviderError, type FormsMode, type LeadProvider } from './providers.ts';
import { rateLimitKey, type RateLimiter } from './ratelimit.ts';
import { MAX_BODY_BYTES, validateBody, type FieldErrorCode, type FormId } from './schema.ts';

/**
 * Server-side processing for one form submission. Order matters:
 *  1. disabled mode short-circuits before the body is read (no personal data processed);
 *  2. transport checks (method, content type, size, origin);
 *  3. allowlist + validation, honeypot, rate limit;
 *  4. provider call.
 * Responses are generic: they never reveal whether an address is already known.
 */

export type SubmissionOutcome =
  | { kind: 'disabled'; status: 503 }
  | { kind: 'bad-request'; status: 400 | 403 | 405 | 413 | 415 }
  | { kind: 'invalid'; status: 422; errors: Record<string, FieldErrorCode>; values: Record<string, string> }
  | { kind: 'rate-limited'; status: 429; retryAfterSeconds: number }
  | { kind: 'provider-error'; status: 502 }
  | { kind: 'accepted'; status: 200; confirmationRequired: boolean };

export interface HandlerDeps {
  mode: FormsMode;
  provider: LeadProvider | null;
  rateLimiter: RateLimiter;
  rateLimitSalt: string;
  clientAddress: string;
}

async function readLimitedText(request: Request, limit: number): Promise<string | null> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > limit) return null;
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(merged);
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (origin !== new URL(request.url).origin) return false;
  const fetchSite = request.headers.get('sec-fetch-site');
  return fetchSite === null || fetchSite === 'same-origin';
}

export async function handleSubmission(
  request: Request,
  formId: FormId,
  locale: string,
  deps: HandlerDeps,
): Promise<SubmissionOutcome> {
  const done = (o: SubmissionOutcome, reason?: string): SubmissionOutcome => {
    safeLog({ event: 'form-submission', form: formId, outcome: o.kind, status: o.status, mode: deps.mode, ...(reason ? { reason } : {}) });
    return o;
  };

  if (deps.mode === 'disabled' || !deps.provider) return done({ kind: 'disabled', status: 503 });

  if (request.method !== 'POST') return done({ kind: 'bad-request', status: 405 });
  const contentType = (request.headers.get('content-type') ?? '').split(';')[0]!.trim().toLowerCase();
  if (contentType !== 'application/x-www-form-urlencoded') return done({ kind: 'bad-request', status: 415 });
  if (!sameOrigin(request)) return done({ kind: 'bad-request', status: 403 }, 'origin');

  let body: string | null;
  try {
    body = await readLimitedText(request, MAX_BODY_BYTES);
  } catch {
    return done({ kind: 'bad-request', status: 400 }, 'encoding');
  }
  if (body === null) return done({ kind: 'bad-request', status: 413 });

  const result = validateBody(formId, body);
  if (!result.ok && result.reason !== 'fields') return done({ kind: 'bad-request', status: 400 }, result.reason);

  const limit = await deps.rateLimiter.hit(await rateLimitKey(deps.rateLimitSalt, deps.clientAddress, formId));
  if (!limit.allowed) return done({ kind: 'rate-limited', status: 429, retryAfterSeconds: limit.retryAfterSeconds });

  if (!result.ok) return done({ kind: 'invalid', status: 422, errors: result.errors, values: result.values });

  const v = result.values;
  const confirmationRequired = formId === 'keep-informed' || (formId === 'early-access' && v['updatesConsent'] === 'yes');

  // Honeypot: behave exactly like success so bots learn nothing, but do nothing.
  if (result.honeypotTripped) return done({ kind: 'accepted', status: 200, confirmationRequired }, 'honeypot');

  try {
    if (formId === 'keep-informed') {
      await deps.provider.subscribe(v['email']!, locale);
    } else if (formId === 'early-access') {
      await deps.provider.requestEarlyAccess({
        email: v['email']!,
        organization: v['organization'] ?? '',
        role: v['role'] ?? '',
        useCase: v['useCase'] ?? '',
        locale,
      });
      // A request is not a newsletter sign-up. Updates only with separate, explicit consent + DOI.
      if (v['updatesConsent'] === 'yes') await deps.provider.subscribe(v['email']!, locale);
    } else {
      await deps.provider.sendContact({ email: v['email']!, message: v['message']!, locale });
    }
  } catch (error) {
    if (error instanceof ProviderError) return done({ kind: 'provider-error', status: 502 });
    throw error;
  }

  return done({ kind: 'accepted', status: 200, confirmationRequired });
}
