import { resolveFormsMode, SandboxProvider, type FormsMode, type LeadProvider } from './providers.ts';
import { MemoryRateLimiter } from './ratelimit.ts';

/**
 * Process-level wiring for form handling. Read once per server instance.
 * No API keys exist here or anywhere client-side.
 */

export const FORMS_MODE: FormsMode = resolveFormsMode({
  FORMS_MODE: process.env.FORMS_MODE,
  VERCEL_ENV: process.env.VERCEL_ENV,
});

export const provider: LeadProvider | null = FORMS_MODE === 'sandbox' ? new SandboxProvider() : null;

/** 5 submissions per 10 minutes per form per client. Per-instance only (see G-RATELIMIT). */
export const rateLimiter = new MemoryRateLimiter(5, 10 * 60 * 1000);

/** Per-process salt so rate-limit keys cannot be reversed to IP addresses. */
export const rateLimitSalt: string = crypto.randomUUID();
