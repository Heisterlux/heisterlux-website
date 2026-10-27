/**
 * Claim lint: phrases that overstate what exists, imply traction that is not evidenced, or
 * give guarantees that are not technically proven. Used by tests/copy.test.ts (source copy) and
 * scripts/verify-dist.ts (rendered HTML). Add a rule whenever a review finds a new overclaim.
 */
export interface ClaimRule {
  pattern: RegExp;
  why: string;
}

export const CLAIM_RULES: readonly ClaimRule[] = [
  { pattern: /heisterlux records them separately/i, why: 'present-tense product claim; use pre-launch wording ("is being built to keep these distinctions explicit")' },
  { pattern: /we are working with a small number of organi[sz]ations/i, why: 'implies an active programme / traction that is not evidenced' },
  { pattern: /working out pricing together/i, why: 'implies joint pricing research with early customers that is not evidenced' },
  { pattern: /nothing (that )?you (entered|enter here)[^.]*(sent|stored)/i, why: 'absolute data-handling guarantee not technically proven' },
  { pattern: /nothing was sent( or stored)?/i, why: 'a provider timeout can occur after the provider accepted the request' },
  { pattern: /we only use this to reply to you/i, why: 'wrong for "Keep me informed"; hints must be purpose-bound per form' },
  { pattern: /heisterlux does not scan/i, why: 'permanent product boundary; only the current scope is known (use "the current scope ... does not scan")' },
  { pattern: /(it|heisterlux) relies on people recording this; it does not scan/i, why: 'presents manual entry as the permanent model' },
  { pattern: /points (straight|directly) to (this|the) reliance/i, why: 'a dependency path does not prove a decision is affected' },
  { pattern: /ruled out for the ones it cannot/i, why: 'implies certainty about what is not affected' },
  { pattern: /decisions are affected when/i, why: '"affected" must be "may be affected"' },
  { pattern: /accessed through|^relied on for$|>relied on for</i, why: 'old diagram connectors that chained Deployment Context into application and reliance' },
  { pattern: /\blayer [1-4]\b/i, why: 'numbered layers suggest a chain' },
  { pattern: /sufficient level of AI literacy is mandated/i, why: 'legal conclusion not supported by the amended Article 4' },
];

export function findClaimViolations(text: string): { why: string; match: string }[] {
  const hits: { why: string; match: string }[] = [];
  for (const rule of CLAIM_RULES) {
    const m = text.match(rule.pattern);
    if (m) hits.push({ why: rule.why, match: m[0] });
  }
  return hits;
}
