import { RELEASES } from './releases.ts';

/**
 * Capability registry — the single source of product truth for Product, Roadmap and future
 * release/documentation pages.
 *
 * Status rules (enforced below, a violation fails the build):
 * - `available` requires ALL of: a referenced customer release with production evidence,
 *   a working customer-facing capability, recorded scope and audience, a support route and
 *   publication approval.
 * - A merge, migration, database object, architecture decision or DEV test is NOT evidence
 *   of customer availability. Such items may be recorded as `internalEvidence` for
 *   traceability, but they cannot promote a status.
 * - History is append-only. Status changes and withdrawals stay visible.
 */

export type CapabilityStatus = 'available' | 'in-development' | 'up-next' | 'exploring';

export interface CapabilityText {
  name: string;
  summary: string;
  scope: string;
  limitations: string[];
}

export interface CapabilityRecord {
  id: string;
  stage: 'visibility' | 'reliance' | 'change' | 'impact' | 'action' | 'foundation';
  status: CapabilityStatus;
  reviewedOn: string;
  text: Partial<Record<'en' | 'nl' | 'de', CapabilityText>>;
  /** Internal traceability only. Never rendered, never counts toward `available`. */
  internalEvidence: string[];
  /** Required for `available`. */
  availability?: {
    releaseRefs: string[];
    audience: string;
    support: string;
    publicationApprovedBy: string;
  };
  history: { on: string; status: CapabilityStatus | 'withdrawn'; note: string }[];
  withdrawn?: { on: string; reason: string };
}

const REVIEWED = '2026-09-30';

export const CAPABILITIES: readonly CapabilityRecord[] = [
  {
    id: 'ai-inventory',
    stage: 'visibility',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'AI inventory',
        summary: 'Record which AI systems and AI-enabled services your organization uses, per location.',
        scope: 'Organization-level register of AI systems, capabilities and the services they appear in.',
        limitations: [
          'Entries are recorded by people in your organization; Heisterlux does not scan devices or networks.',
          'Not available to customers yet.',
        ],
      },
    },
    internalEvidence: ['Asset register exists in the product codebase; DEV environment only.'],
    history: [{ on: REVIEWED, status: 'in-development', note: 'First public listing.' }],
  },
  {
    id: 'deployment-context',
    stage: 'visibility',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Deployment Contexts',
        summary:
          'Record how your organization obtains access to an AI capability — for example an organization-managed licence, an individual subscription or an API agreement.',
        scope: 'Distinguishes the access route from the AI system itself and from the application it appears in.',
        limitations: [
          'The host application (such as a word processor or chat tool) is recorded separately; it is not a Deployment Context.',
          'Not available to customers yet.',
        ],
      },
    },
    internalEvidence: ['Deployment Context model exists on DEV only; not released to production.'],
    history: [{ on: REVIEWED, status: 'in-development', note: 'First public listing.' }],
  },
  {
    id: 'reliance-criticality',
    stage: 'reliance',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Reliance and criticality',
        summary:
          'Describe what your organization relies on an AI-enabled service for, how critical that is, and why the reliance was considered justified.',
        scope: 'Per use: the decision or task supported, its criticality, and the recorded rationale.',
        limitations: ['Criticality is an organizational judgement that Heisterlux records; it does not assign it for you.', 'Not available to customers yet.'],
      },
    },
    internalEvidence: ['Criticality recording exists in the product codebase; DEV environment only.'],
    history: [{ on: REVIEWED, status: 'in-development', note: 'First public listing.' }],
  },
  {
    id: 'change-signals',
    stage: 'change',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Review signals',
        summary: 'Flag recorded reliances that need a fresh look because something about them changed or aged.',
        scope: 'Signals derived from information recorded in Heisterlux.',
        limitations: [
          'Signals depend on what has been recorded; Heisterlux does not yet watch vendors for changes automatically.',
          'Not available to customers yet.',
        ],
      },
    },
    internalEvidence: ['Review-signal view exists on DEV only.'],
    history: [{ on: REVIEWED, status: 'in-development', note: 'First public listing.' }],
  },
  {
    id: 'impact-view',
    stage: 'impact',
    status: 'up-next',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Impact view',
        summary:
          'When an AI system, its access route or its terms change, show which applications, decisions and reliances may be affected.',
        scope: 'Traversal from a change to the recorded uses that depend on it.',
        limitations: ['Planned. Scope may change before development starts.'],
      },
    },
    internalEvidence: [],
    history: [{ on: REVIEWED, status: 'up-next', note: 'First public listing.' }],
  },
  {
    id: 'proportional-action',
    stage: 'action',
    status: 'exploring',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Proportionate next steps',
        summary: 'Suggest a next step that fits the size of the change and the criticality of the reliance — from "note it" to "review before continuing".',
        scope: 'Guidance on what to do next; decisions stay with your organization.',
        limitations: ['Exploring. We may not build this in this form.', 'Heisterlux does not provide legal advice.'],
      },
    },
    internalEvidence: [],
    history: [{ on: REVIEWED, status: 'exploring', note: 'First public listing.' }],
  },
  {
    id: 'change-sources',
    stage: 'change',
    status: 'exploring',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'External change sources',
        summary: 'Bring in published vendor changes — such as model retirements or terms updates — as input for review signals.',
        scope: 'Curated, source-linked change records.',
        limitations: ['Exploring. Coverage, sources and accuracy are open questions.'],
      },
    },
    internalEvidence: [],
    history: [{ on: REVIEWED, status: 'exploring', note: 'First public listing.' }],
  },
  {
    id: 'evidence-trail',
    stage: 'foundation',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Evidence trail',
        summary: 'Keep a record of who recorded or changed what, and when, so reliance decisions can be explained later.',
        scope: 'Change history for recorded information.',
        limitations: ['Not available to customers yet.', 'Not a certified audit log.'],
      },
    },
    internalEvidence: ['Audit event infrastructure exists on DEV only; under test.'],
    history: [{ on: REVIEWED, status: 'in-development', note: 'First public listing.' }],
  },
];

// ---- Enforcement ----
export function validateCapabilities(records: readonly CapabilityRecord[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const c of records) {
    if (ids.has(c.id)) errors.push(`Duplicate capability id ${c.id}`);
    ids.add(c.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.reviewedOn)) errors.push(`${c.id}: reviewedOn must be YYYY-MM-DD`);
    if (c.history.length === 0) errors.push(`${c.id}: history must not be empty`);
    const last = c.history[c.history.length - 1];
    if (last && !c.withdrawn && last.status !== c.status) errors.push(`${c.id}: latest history entry does not match status`);
    if (c.withdrawn && last?.status !== 'withdrawn') errors.push(`${c.id}: withdrawal must be recorded in history`);
    if (!c.text.en) errors.push(`${c.id}: English text is required`);
    if (c.status === 'available') {
      const a = c.availability;
      if (!a) {
        errors.push(`${c.id}: Available requires availability evidence`);
        continue;
      }
      if (!a.audience.trim()) errors.push(`${c.id}: Available requires a recorded audience`);
      if (!a.support.trim()) errors.push(`${c.id}: Available requires a support route`);
      if (!a.publicationApprovedBy.trim()) errors.push(`${c.id}: Available requires publication approval`);
      if (a.releaseRefs.length === 0) errors.push(`${c.id}: Available requires at least one customer release`);
      for (const ref of a.releaseRefs) {
        const rel = RELEASES.find((r) => r.id === ref);
        if (!rel) errors.push(`${c.id}: unknown release ${ref}`);
        else if (rel.kind !== 'customer-release' || !rel.productionEvidence.trim() || rel.withdrawn) {
          errors.push(`${c.id}: release ${ref} is not valid production evidence`);
        }
      }
    }
  }
  return errors;
}

{
  const errors = validateCapabilities(CAPABILITIES);
  if (errors.length) throw new Error(`Capability registry invalid:\n- ${errors.join('\n- ')}`);
}
