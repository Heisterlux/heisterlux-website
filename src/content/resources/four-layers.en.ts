import type { ResourceContent } from './index.ts';

export const en: ResourceContent = {
  slug: 'four-layers-of-ai-use',
  title: 'Four layers of AI use worth keeping apart',
  description:
    'AI system, Deployment Context, application and organizational reliance: why separating them makes AI change easier to reason about.',
  summary:
    'When people say "we use AI for this", they usually compress four different things into one sentence. Keeping them apart is what makes it possible to tell, later, whether a change matters.',
  sections: [
    {
      anchor: 'the-problem',
      heading: 'One sentence, four different things',
      paragraphs: [
        '"Our support team uses AI to draft replies" sounds like one fact. It is at least four: a model that generates text, a way the organization got access to it, a tool the team works in, and a task the organization now depends on.',
        'Each of those can change independently. A vendor can retire a model version. A licence can move to a different plan. A familiar tool can switch on a new AI feature. A team can quietly start using drafts for something more consequential than before. If the four are recorded as one line, none of these changes can be traced to what they affect.',
      ],
    },
    {
      anchor: 'ai-system',
      heading: '1. The AI system or capability',
      paragraphs: [
        'The model or AI service that actually produces the output — for example a specific large language model, a transcription model or an image classifier. This is the layer vendors version, update and eventually retire.',
      ],
    },
    {
      anchor: 'deployment-context',
      heading: '2. The Deployment Context',
      paragraphs: [
        'How your organization obtains access to that capability. An organization-managed enterprise licence, an individual employee’s personal subscription and a direct API agreement can give access to the same underlying model under very different terms, controls and data handling.',
        'The Deployment Context is about the access route and its terms. It is not the place where AI shows up on screen.',
      ],
    },
    {
      anchor: 'application',
      heading: '3. The application or service',
      paragraphs: [
        'The product in which the AI appears: a word processor, a mail client, a chat tool, a design tool, a helpdesk system. The same application can host AI obtained through different Deployment Contexts, and the same Deployment Context can surface in several applications.',
        'This is why a host application such as a word processor, a meeting tool, a mail client or a design tool is not itself a Deployment Context. Treating it as one hides the question that matters: under which arrangement is this AI being used here?',
      ],
    },
    {
      anchor: 'reliance',
      heading: '4. Organizational use and reliance',
      paragraphs: [
        'What the organization depends on the AI for: the decision, task or service that would be affected if the AI behaved differently or disappeared. Reliance also carries a reason — why that dependence was considered acceptable at the time.',
        'Recording the reason is what turns an inventory into something you can revisit. When one of the other three layers changes, the recorded reason tells you what to check.',
      ],
    },
    {
      anchor: 'example',
      heading: 'A worked example',
      paragraphs: ['Take the support team again, recorded in four layers:'],
      list: [
        'AI system: a general-purpose language model, version as stated by the vendor.',
        'Deployment Context: organization-managed licence under the company’s business agreement.',
        'Application: the helpdesk tool the team uses every day.',
        'Reliance: first drafts of replies to customer complaints, always reviewed by an agent before sending; considered acceptable because a person approves every reply.',
      ],
    },
    {
      anchor: 'why-it-helps',
      heading: 'Why the separation helps',
      paragraphs: [
        'Now a model retirement touches layer 1 and points directly to the reliance in layer 4. A licence change touches layer 2. A new feature in the helpdesk tool touches layer 3. And if the team stops reviewing drafts before sending, the reason recorded in layer 4 no longer holds — which is itself a change worth noticing.',
        'This is the structure Heisterlux is being built around. It is also a useful way to think about AI use with nothing more than a spreadsheet.',
      ],
    },
  ],
  limitations: [
    'The four layers are Heisterlux’s working model, not a legal or standardized taxonomy. Regulations and standards use their own definitions, such as "AI system", "provider" and "deployer".',
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
