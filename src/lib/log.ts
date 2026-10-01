/**
 * Structured logging that cannot carry personal data: only whitelisted keys with short,
 * code-like values are emitted. Never pass emails, messages, names, IPs or tokens.
 */

type SafeValue = string | number | boolean;
const SAFE_KEYS = new Set(['event', 'form', 'outcome', 'status', 'mode', 'reason']);
const SAFE_VALUE = /^[a-z0-9._-]{1,64}$/i;

export function safeLog(fields: Record<string, SafeValue>): Record<string, SafeValue> {
  const out: Record<string, SafeValue> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (!SAFE_KEYS.has(k)) continue;
    if (typeof v === 'string' && !SAFE_VALUE.test(v)) continue;
    out[k] = v;
  }
  console.info(JSON.stringify(out));
  return out;
}
