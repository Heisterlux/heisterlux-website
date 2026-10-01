import type { ResourceContent } from './index.ts';

/**
 * Legal basis verified on 2026-10-01 against the official EUR-Lex text of Regulation (EU) 2026/1744
 * (see evidence/r5-legal-verification.md). Statements about the law below follow that text, not the
 * Commission's Q&A page, which mixes formulations written at different times.
 */
export const en: ResourceContent = {
  slug: 'ai-literacy-under-the-eu-ai-act',
  title: 'AI literacy under the EU AI Act: what Article 4 says now',
  description:
    'Article 4 of the EU AI Act on AI literacy was replaced by Regulation (EU) 2026/1744. What the official text says, which dates apply, and what this article does not conclude.',
  summary:
    'Article 4 of the EU AI Act has applied since 2 February 2025. Regulation (EU) 2026/1744 replaced its text; it was published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026. This article separates the proposal, the adopted amendment and the obligation that applies, and says what it cannot conclude for your organization.',
  sections: [
    {
      anchor: 'sources',
      heading: 'What is official and what is commentary',
      paragraphs: [
        'The statements about the law in this article follow the official text of Regulation (EU) 2026/1744 and of the original AI Act, Regulation (EU) 2024/1689, both on EUR-Lex.',
        'The European Commission also publishes a Q&A page on AI literacy. It is explanatory material, not the legal text. It contains passages written at different times: some describe the Digital Omnibus on AI as a proposal, others as already in force, and its timing language is not fully consistent with the Official Journal. We therefore do not draw legal conclusions from it.',
      ],
    },
    {
      anchor: 'original-text',
      heading: 'The original obligation (since 2 February 2025)',
      paragraphs: [
        'As adopted in 2024, Article 4 required providers and deployers of AI systems to take measures to ensure, to their best extent, a sufficient level of AI literacy of their staff and of other persons dealing with the operation and use of AI systems on their behalf, taking into account their knowledge, experience, education and training and the context of use.',
        'Chapter I of the AI Act, which contains Article 4, applies from 2 February 2025. The amending Regulation keeps that date for Chapters I and II.',
      ],
    },
    {
      anchor: 'amendment',
      heading: 'What Regulation (EU) 2026/1744 changed',
      paragraphs: ['The Regulation replaces Article 4 with a new text. According to the official wording:'],
      list: [
        'Paragraph 1: providers and deployers shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf, taking into account their knowledge, experience, education and training, the context of use and the persons on whom the systems are used. The obligation does not require them to guarantee any specific level of AI literacy of any individual.',
        'Paragraph 2: the Commission and the Member States shall support and facilitate providers and deployers, in particular SMEs; the Commission shall publish practical examples of compliance on the single information platform.',
        'Paragraph 3: the AI Board shall adopt recommendations, taking into account European competence frameworks, including common objectives.',
      ],
    },
    {
      anchor: 'status',
      heading: 'Proposal, adopted amendment, applicable obligation',
      paragraphs: ['These are three different things and should not be mixed up:'],
      list: [
        'Proposal: the Commission’s Digital Omnibus on AI proposal. It is the earlier stage; the adopted text is what counts.',
        'Adopted amendment: Regulation (EU) 2026/1744, signed on 8 July 2026 and published in the Official Journal on 24 July 2026. It enters into force on the third day after publication, which is 27 July 2026.',
        'Applicable obligation: Article 4 has applied since 2 February 2025. From 27 July 2026 the replaced text is the applicable one. The final provisions as we read them set no later application date for Article 4.',
      ],
    },
    {
      anchor: 'not-concluded',
      heading: 'What this article does not conclude',
      paragraphs: [
        'Whether and how your organization meets Article 4, what counts as appropriate measures in your context, and how national law or sector rules interact with it are questions for you and your legal advisers. This article does not answer them and Heisterlux does not assess compliance.',
      ],
    },
    {
      anchor: 'visibility',
      heading: 'Where knowing what you use comes in',
      paragraphs: [
        'The new Article 4 refers to the context in which AI systems are used and to the persons on whom they are used. Describing that context starts with knowing which AI is in use, through which access route, and for what. The Commission’s Q&A lists a general understanding of what AI an organization uses among the steps to consider. That is guidance, not a legal requirement, and a simple, honest list is enough to start with.',
      ],
    },
  ],
  limitations: [
    'Legislation and guidance in this area can change again. This article reflects the official text as checked on 1 October 2026; later corrigenda, delegated or implementing acts and national measures are not covered.',
    'The Commission’s Q&A page was last updated on 27 July 2026 and mixes historical and current formulations. It is not relied on for legal statements here.',
    'This article is general information, not legal advice. Heisterlux does not assess or certify compliance.',
  ],
  sources: [
    {
      title: 'Regulation (EU) 2026/1744 amending Regulation (EU) 2024/1689 (Digital Omnibus on AI)',
      publisher: 'EUR-Lex (Official Journal of the European Union, L series, 24.7.2026)',
      url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj',
      checkedOn: '2026-10-01',
    },
    {
      title: 'Regulation (EU) 2024/1689 (Artificial Intelligence Act)',
      publisher: 'EUR-Lex (Official Journal of the European Union, L series, 12.7.2024)',
      url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
      checkedOn: '2026-10-01',
    },
    {
      title: 'AI Literacy — Questions & Answers (explanatory, not the legal text)',
      publisher: 'European Commission, Shaping Europe’s digital future',
      url: 'https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers',
      checkedOn: '2026-10-01',
    },
  ],
};
