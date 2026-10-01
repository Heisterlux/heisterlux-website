import type { ResourceContent } from './index.ts';

export const en: ResourceContent = {
  slug: 'ai-literacy-under-the-eu-ai-act',
  title: 'AI literacy under the EU AI Act: starting from what you use',
  description:
    'Article 4 of the EU AI Act concerns AI literacy for providers and deployers of AI systems. A short, sourced orientation — and why knowing what AI you use comes first.',
  summary:
    'Article 4 of the EU AI Act, on AI literacy, has applied since 2 February 2025. According to the European Commission, it has since been amended through the Digital Omnibus on AI. The Commission’s own guidance begins with a question many organizations cannot yet answer: what AI is used in our organization?',
  sections: [
    {
      anchor: 'what-article-4-covers',
      heading: 'What Article 4 covers',
      paragraphs: [
        'Article 4 concerns providers and deployers of AI systems and the AI literacy of their staff and of other people who deal with AI systems on their behalf. The European Commission states that the article entered into application on 2 February 2025.',
        'The Commission also reports that Article 4 was amended through the Digital Omnibus on AI. Its Q&A describes the amended text as keeping AI literacy as an obligation for providers and deployers, without mandating a specific or "sufficient" level. Because the wording has changed, check the current consolidated text and the Commission’s Q&A rather than older summaries.',
      ],
    },
    {
      anchor: 'what-it-does-not-require',
      heading: 'What the Commission says it does not require',
      paragraphs: ['According to the Commission’s Q&A on AI literacy:'],
      list: [
        'There is no obligation to measure employees’ knowledge of AI.',
        'No specific governance structure is mandated.',
        'Following the practices in the Commission’s living repository does not automatically give a presumption of compliance.',
      ],
    },
    {
      anchor: 'where-to-start',
      heading: 'Where the Commission suggests starting',
      paragraphs: [
        'The Q&A lists steps and questions organizations should consider. The first is a general understanding of AI within the organization, including the question "What AI is used in our organisation?". Others concern the organization’s role (provider or deployer), the risks of the AI systems involved, and tailoring measures to people’s knowledge and the context of use.',
      ],
    },
    {
      anchor: 'why-visibility-first',
      heading: 'Why visibility comes first',
      paragraphs: [
        'Every other step depends on the first. You cannot decide what people need to understand about an AI system, or what risks they should be aware of, without knowing which AI systems are in use, through which arrangements, and for what. That is the same starting point Heisterlux is being built around — but it is a starting point anyone can take with a simple, honest list.',
      ],
    },
  ],
  limitations: [
    'Legislation and guidance in this area are changing. This article reflects the sources as checked on the review date shown and may be out of date after that.',
    'The summary relies on the European Commission’s Q&A. Only the official legal text is authoritative; national authorities may issue their own guidance.',
    'This article is general information, not legal advice. Heisterlux does not assess or certify compliance.',
  ],
  sources: [
    {
      title: 'AI Literacy — Questions & Answers',
      publisher: 'European Commission, Shaping Europe’s digital future',
      url: 'https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers',
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
