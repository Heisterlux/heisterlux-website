/**
 * Rate limiting.
 *
 * The in-memory limiter is a TEST HELPER, not a finished production facility. It only counts within
 * one process; on serverless it would be per-instance and not durable. A durable, project-scoped
 * store (or a platform firewall rule) must exist and be authorized before forms are enabled
 * anywhere public — launch gate G-RATELIMIT.
 */

export interface RateLimiter {
  hit(key: string): Promise<{ allowed: boolean; retryAfterSeconds: number }>;
}

export class InMemoryTestRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, { start: number; count: number }>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;

  constructor(limit: number, windowMs: number, now: () => number = () => Date.now()) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
  }

  async hit(key: string): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
    const t = this.now();
    const w = this.windows.get(key);
    if (!w || t - w.start >= this.windowMs) {
      this.windows.set(key, { start: t, count: 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    w.count += 1;
    const retryAfterSeconds = Math.ceil((w.start + this.windowMs - t) / 1000);
    return { allowed: w.count <= this.limit, retryAfterSeconds };
  }
}

/** Keys never contain raw IP addresses: they are salted SHA-256 hashes. */
export async function rateLimitKey(salt: string, clientAddress: string, formId: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}|${formId}|${clientAddress}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
