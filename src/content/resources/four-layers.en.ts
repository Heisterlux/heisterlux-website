import type { ResourceContent } from './index.ts';

export const en: ResourceContent = {
  slug: 'four-layers-of-ai-use',
  title: 'Four distinctions in AI use worth keeping explicit',
  description:
    'AI system, Deployment Context, application and organizational reliance: how they relate, and why keeping them distinct makes AI change easier to reason about.',
  summary:
    'When people say "we use AI for this", they usually compress several different things into one sentence. Keeping them distinct is what makes it possible to ask, later, whether a change may matter. They are not a chain: each can vary independently of the others.',
  sections: [
    {
      anchor: 'the-problem',
      heading: 'One sentence, several different things',
      paragraphs: [
        '"Our support team uses AI to draft replies" sounds like one fact. It is at least four: a model that generates text, a way the organization got access to it, a tool the team works in, and a task the organization now depends on.',
        'Each of those can change independently. A vendor can retire a model version. A licence can move to a different plan. A familiar tool can switch on a new AI feature. A team can quietly start using drafts for something more consequential than before. If everything is recorded as one line, none of these changes can be traced to what it may affect.',
      ],
    },
    {
      anchor: 'ai-system',
      heading: 'The AI system or capability',
      paragraphs: [
        'The model or AI service that actually produces the output — for example a specific large language model, a transcription model or an image classifier. This is what vendors version, update and eventually retire.',
      ],
    },
    {
      anchor: 'deployment-context',
      heading: 'The Deployment Context',
      paragraphs: [
        'How your organization obtains access to that capability. An organization-managed enterprise licence, an individual employee’s personal subscription and a direct API agreement can give access to the same underlying model under very different terms, controls and data handling.',
        'The Deployment Context is about the access route and its terms. It is not the place where AI shows up on screen.',
      ],
    },
    {
      anchor: 'application',
      heading: 'The application or service',
      paragraphs: [
        'The product in which the AI capability appears or is available: a word processor, a mail client, a chat tool, a design tool, a helpdesk system.',
        'This is why a host application such as a word processor, a meeting tool, a mail client or a design tool is not itself a Deployment Context. Treating it as one hides the question that matters: under which arrangement is this capability being used here?',
      ],
    },
    {
      anchor: 'reliance',
      heading: 'Organizational use and reliance',
      paragraphs: [
        'What the organization depends on a concrete use for: the decision, task or service that could be affected if the AI behaved differently or disappeared. Reliance also carries a reason — why that dependence was considered acceptable at the time.',
        'Recording the reason is what turns an inventory into something you can revisit. When something else changes, the recorded reason is a starting point for what to check.',
      ],
    },
    {
      anchor: 'how-they-relate',
      heading: 'How they relate',
      paragraphs: ['These four are not nested and not one-to-one:'],
      list: [
        'One AI capability can be available in several applications, and one application can offer several capabilities.',
        'The same capability can be reached through different Deployment Contexts, with different terms and controls.',
        'An organizational use points at the concrete combination that is actually used: this capability, in this application, reached this way.',
        'A change can touch any of them. Whether it matters depends on what the organization relies on, and that is a human judgement.',
      ],
    },
    {
      anchor: 'example',
      heading: 'A worked example',
      paragraphs: ['Take the support team again, described with the four distinctions:'],
      list: [
        'AI system or capability: a general-purpose language model, version as stated by the vendor.',
        'Deployment Context: organization-managed licence under the company’s business agreement.',
        'Application or service: the helpdesk tool in which the team uses it every day.',
        'Organizational use and reliance: first drafts of replies to customer complaints, always reviewed by an agent before sending; considered acceptable because a person approves every reply.',
      ],
    },
    {
      anchor: 'why-it-helps',
      heading: 'Why keeping them distinct helps',
      paragraphs: [
        'A model retirement concerns the AI capability; a record like this can then point to the uses that may depend on it, for people to assess. A licence change concerns the Deployment Context. A new feature in the helpdesk tool concerns the application. And if the team stops reviewing drafts before sending, the reason recorded for the reliance may no longer hold — which is itself a change worth noticing. None of these shows by itself that a decision is affected or no longer valid.',
        'These are the distinctions Heisterlux is being built to keep explicit. They are also a useful way to think about AI use with nothing more than a spreadsheet.',
      ],
    },
  ],
  limitations: [
    'The four distinctions are Heisterlux’s working model, not a legal or standardized taxonomy. Regulations and standards use their own definitions, such as "AI system", "provider" and "deployer".',
    'Real situations can be messier: one application can embed several AI systems, and a vendor may not disclose which model it uses.',
    'This article is general information, not legal advice.',
  ],
  sources: [
    {
      title: 'OECD AI Principles (including the OECD definition of an AI system)',
      publisher: 'OECD.AI',
      url: 'https://oecd.ai/en/ai-principles',
      checkedOn: '2026-09-30',
    },
    {
      title: 'Artificial Intelligence Risk Management Framework (AI RMF 1.0), NIST AI 100-1',
      publisher: 'National Institute of Standards and Technology',
      url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf',
      checkedOn: '2026-09-30',
    },
    {
      title: 'Regulation (EU) 2024/1689 (Artificial Intelligence Act)',
      publisher: 'EUR-Lex',
      url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
      checkedOn: '2026-09-30',
    },
  ],
};
