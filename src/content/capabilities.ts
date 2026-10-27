import { RELEASES } from './releases.ts';

/**
 * Capability registry — the single source of product truth for Product, Roadmap and future
 * release/documentation pages.
 *
 * Three things are kept apart for every capability:
 *   1. what is built so far (an internal foundation, in development environments only),
 *   2. what is still to build for customers,
 *   3. whether customers can actually use it (only `available`, which needs release evidence).
 *
 * Status rules (enforced below, a violation fails the build):
 * - `available` requires ALL of: a referenced customer release with production evidence,
 *   a working customer-facing capability, recorded scope and audience, a support route and
 *   publication approval.
 * - A merge, migration, database object, architecture decision or DEV test is NOT evidence
 *   of customer availability. Such items may be recorded as `internalEvidence` for
 *   traceability, but they cannot promote a status to `available`.
 * - `up-next` needs an approved direction; a missing customer UI does not by itself mean
 *   `exploring`. A capability with an implemented internal foundation is `in-development`.
 * - History is append-only. Status changes and withdrawals stay visible; an earlier
 *   classification is never rewritten, only followed by a new entry.
 */

export type CapabilityStatus = 'available' | 'in-development' | 'up-next' | 'exploring';

export interface CapabilityText {
  name: string;
  summary: string;
  scope: string;
  /** What exists so far, in internal environments only. */
  built: string;
  /** What is still to build before customers can use it. */
  toBuild: string;
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

const FIRST = '2026-09-30';
const REVIEWED = '2026-10-01';

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
        built: 'An asset register exists in the product codebase and runs in a development environment for internal testing.',
        toBuild: 'Customer onboarding, a production release, a support route and approval to publish.',
        limitations: [
          'In the current scope, entries are recorded by people in your organization. Automatic discovery is not part of it and is not promised.',
        ],
      },
    },
    internalEvidence: ['Asset register exists in the product codebase; DEV environment only.'],
    history: [
      { on: FIRST, status: 'in-development', note: 'First listing.' },
      { on: REVIEWED, status: 'in-development', note: 'Reviewed in WEB-001E-R1: status unchanged; wording aligned with current scope.' },
    ],
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
        scope: 'Describes the access route separately from the AI capability itself and from the application it appears in.',
        built: 'A Deployment Context model exists in a development environment. It has not been released to production.',
        toBuild: 'A production-ready release path, customer onboarding, a support route and approval to publish.',
        limitations: [
          'The host application (such as a word processor or chat tool) is recorded separately; it is not a Deployment Context.',
        ],
      },
    },
    internalEvidence: ['Deployment Context model exists on DEV only; not released to production.'],
    history: [
      { on: FIRST, status: 'in-development', note: 'First listing.' },
      { on: REVIEWED, status: 'in-development', note: 'Reviewed in WEB-001E-R1: status unchanged.' },
    ],
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
        built:
          'An internal foundation for recording organizational uses, their original justification and criticality declarations exists in a development environment. Parts of the recording screens exist there too.',
        toBuild: 'Customer-ready recording flows, verification of who may declare what, a production release, a support route and approval to publish.',
        limitations: ['Criticality is an organizational judgement that Heisterlux records; it does not assign it for you.'],
      },
    },
    internalEvidence: ['Recording of uses, justifications and criticality exists in the product codebase and on DEV only.'],
    history: [
      { on: FIRST, status: 'in-development', note: 'First listing.' },
      { on: REVIEWED, status: 'in-development', note: 'Reviewed in WEB-001E-R1: status unchanged; built / still-to-build separated.' },
    ],
  },
  {
    id: 'change-signals',
    stage: 'change',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Review signals',
        summary: 'Flag recorded reliances that may need a fresh look because something about them changed or aged.',
        scope: 'Signals derived from information recorded in Heisterlux.',
        built: 'A review-signal view exists in a development environment.',
        toBuild: 'Evaluation against real customer data, a production release, a support route and approval to publish.',
        limitations: [
          'Signals depend on what has been recorded. Heisterlux does not yet watch vendors for changes automatically.',
          'A signal is a prompt to look, not a finding that something is wrong.',
        ],
      },
    },
    internalEvidence: ['Review-signal view exists on DEV only.'],
    history: [
      { on: FIRST, status: 'in-development', note: 'First listing.' },
      { on: REVIEWED, status: 'in-development', note: 'Reviewed in WEB-001E-R1: status unchanged.' },
    ],
  },
  {
    id: 'impact-view',
    stage: 'impact',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Impact view',
        summary:
          'When something changes, show which recorded uses may be affected — and where the evidence is not enough to say.',
        scope: 'From a recorded change to the justification items and uses that depend on it, with uncertainty shown.',
        built:
          'An internal foundation determines, for directly recorded justification items, whether their support changed, records a direct affected determination and derives a remaining-support view. It is tested internally and exists in a development environment only.',
        toBuild:
          'Indirect or inferred impact is not built. There is no customer-facing surface yet. Evidence limits and human review have to be designed in before a production release.',
        limitations: [
          'A dependency path or a model change does not by itself show that a decision is affected or no longer valid. People make that judgement.',
          'Only directly recorded items are evaluated today.',
        ],
      },
    },
    internalEvidence: ['Support-change findings and direct affected determinations exist on DEV only (internal foundation, tested internally).'],
    history: [
      { on: FIRST, status: 'up-next', note: 'First listing, classified Up next.' },
      {
        on: REVIEWED,
        status: 'in-development',
        note: 'Corrected in WEB-001E-R1: an implemented internal foundation exists, so Up next understated it. Not Available: no customer integration or release.',
      },
    ],
  },
  {
    id: 'proportional-action',
    stage: 'action',
    status: 'in-development',
    reviewedOn: REVIEWED,
    text: {
      en: {
        name: 'Proportionate next steps',
        summary:
          'Suggest a next step that fits the size of a change and the criticality of the reliance — for example reconfirm, reassess or escalate — based on recorded facts and declarations.',
        scope:
          'Rule-based recommendations derived from recorded facts, declared criticality and the state of the supporting evidence. A recommendation is a suggestion: not a decision, and not enforced.',
        built:
          'A deterministic, rule-based recommendation foundation (no language model) has been tested, promoted in the code repository and activated in a development environment. It is internal only.',
        toBuild:
          'A customer-facing explanation and surface, a way for customers to declare criticality and record decisions with verified authority, a production release, a support route and approval to publish.',
        limitations: [
          'Missing information produces "insufficient basis", not a conclusion.',
          'Heisterlux does not provide legal advice, and recommendations are not legal or regulatory requirements.',
        ],
      },
    },
    internalEvidence: ['Recommendation foundation promoted in the code repository and activated on DEV; internal only, no customer integration.'],
    history: [
      { on: FIRST, status: 'exploring', note: 'First listing, classified Exploring.' },
      {
        on: REVIEWED,
        status: 'in-development',
        note: 'Corrected in WEB-001E-R1: Exploring was under-evidenced. A tested internal foundation exists and is activated in a development environment. Not Available: no customer-facing integration.',
      },
    ],
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
        built: 'Nothing built so far.',
        toBuild: 'A decision on whether and how published vendor changes can be brought in reliably. Sources, coverage and accuracy are open questions.',
        limitations: ['Exploring. We may not build this, or not in this form.'],
      },
    },
    internalEvidence: ['Open design question: who supplies verified change information. No approved direction.'],
    history: [
      { on: FIRST, status: 'exploring', note: 'First listing.' },
      { on: REVIEWED, status: 'exploring', note: 'Reviewed in WEB-001E-R1: stays Exploring; no approved direction and no implementation.' },
    ],
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
        built: 'Append-only recording with history exists in a development environment. Internal testing of the audit trail returned findings that are still open.',
        toBuild: 'Close the open findings, re-test independently, add customer-facing history views, then a production release, a support route and approval to publish.',
        limitations: ['Not a certified audit log.'],
      },
    },
    internalEvidence: ['Audit event infrastructure exists on DEV only; under test with open findings.'],
    history: [
      { on: FIRST, status: 'in-development', note: 'First listing.' },
      { on: REVIEWED, status: 'in-development', note: 'Reviewed in WEB-001E-R1: status unchanged; open test findings stated.' },
    ],
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
    for (const [locale, text] of Object.entries(c.text)) {
      if (!text.built.trim()) errors.push(`${c.id}/${locale}: "built" must say what exists (or that nothing does)`);
      if (!text.toBuild.trim()) errors.push(`${c.id}/${locale}: "toBuild" must say what is still missing`);
    }
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
