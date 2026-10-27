import { resolveFormsMode, SandboxProvider, type FormsMode, type LeadProvider } from './providers.ts';
import { InMemoryTestRateLimiter } from './ratelimit.ts';

/**
 * Process-level wiring for form handling. Read once per server instance.
 * No API keys exist here or anywhere client-side.
 */

export const FORMS_MODE: FormsMode = resolveFormsMode({
  FORMS_MODE: process.env.FORMS_MODE,
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
});

export const provider: LeadProvider | null = FORMS_MODE === 'sandbox' ? new SandboxProvider() : null;

/**
 * TEST HELPER ONLY. Per-process memory, not durable, not shared between instances: it is not a
 * production rate limit (launch gate G-RATELIMIT). It is only ever reached in local sandbox mode,
 * because disabled mode returns before any rate-limit code runs.
 */
export const rateLimiter = new InMemoryTestRateLimiter(5, 10 * 60 * 1000);

/** Per-process salt so rate-limit keys cannot be reversed to IP addresses. */
export const rateLimitSalt: string = crypto.randomUUID();
