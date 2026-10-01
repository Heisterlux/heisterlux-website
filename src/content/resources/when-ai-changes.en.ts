import type { ResourceContent } from './index.ts';

export const en: ResourceContent = {
  slug: 'when-the-ai-you-rely-on-changes',
  title: 'When the AI you rely on changes',
  description:
    'Model retirements, new versions and changed terms are routine. How to notice them and decide, proportionately, whether they matter to you.',
  summary:
    'AI services change on the vendor’s schedule, not yours. Several major providers publish deprecation and retirement schedules for their models. Whether a given change matters depends on what your organization relies on that model for.',
  sections: [
    {
      anchor: 'change-is-routine',
      heading: 'Change is routine, not exceptional',
      paragraphs: [
        'Providers of AI models regularly release new versions and retire old ones. Several of them publish this on dedicated pages: lists of deprecated models, planned retirement dates and suggested replacements. The sources below link to some of these pages.',
        'Retirement is only one kind of change. Terms of service, data-handling commitments, pricing plans, regional availability and default settings can change too, and so can the way an application you already use integrates AI.',
      ],
    },
    {
      anchor: 'kinds-of-change',
      heading: 'Kinds of change to watch for',
      paragraphs: ['Mapped to the four distinctions in AI use:'],
      list: [
        'AI system or capability: a model version is deprecated, retired or replaced; behaviour changes between versions.',
        'Deployment Context: a licence, plan or agreement changes — including what happens to the data you send.',
        'Application: a tool you already use adds, removes or changes an AI feature.',
        'Reliance: your own use drifts — the AI is used for something more consequential than when it was first accepted.',
      ],
    },
    {
      anchor: 'does-it-matter',
      heading: 'Does this change matter to us?',
      paragraphs: [
        'The same change can be irrelevant to one team and important to another. A useful way to decide is to go back to why the reliance was accepted in the first place and ask whether that reason still holds.',
      ],
      list: [
        'Which of our uses depend on the thing that changed?',
        'For each, what did we rely on — accuracy, availability, data handling, a person reviewing the output?',
        'Does the change affect that reason directly, possibly, or not at all?',
        'How critical is the decision or task that depends on it?',
      ],
    },
    {
      anchor: 'proportionate-response',
      heading: 'A proportionate response',
      paragraphs: [
        'Not every change needs a review meeting. Recording that a change was seen and judged irrelevant is often enough. A change that touches the reason behind a critical reliance deserves a closer look before continuing. The point is that the response should fit the change and the stakes, and that the judgement is written down.',
      ],
    },
  ],
  limitations: [
    'Vendor lifecycle pages describe each vendor’s own policies, which differ and change. Always read the current page rather than relying on this summary.',
    'Not every vendor publishes a retirement schedule, and changes inside third-party applications are often announced less formally.',
    'This article is general information, not legal or procurement advice.',
  ],
  sources: [
    {
      title: 'Deprecations',
      publisher: 'OpenAI API documentation',
      url: 'https://developers.openai.com/api/docs/deprecations',
      checkedOn: '2026-09-30',
    },
    {
      title: 'Model deprecations',
      publisher: 'Claude documentation (Anthropic)',
      url: 'https://platform.claude.com/docs/en/about-claude/model-deprecations',
      checkedOn: '2026-09-30',
    },
    {
      title: 'Model versions and lifecycle',
      publisher: 'Google Cloud documentation',
      url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions',
      checkedOn: '2026-09-30',
    },
    {
      title: 'Model deprecations and retirements',
      publisher: 'Microsoft Learn (Azure OpenAI in Foundry)',
      url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements',
      checkedOn: '2026-09-30',
    },
  ],
};
