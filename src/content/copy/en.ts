/**
 * English page copy. Status: NEW DRAFT (WEB-001E). No previously approved WEB-001A/B/C copy was
 * found during recovery; nothing here should be presented as approved until reviewed.
 *
 * Claim rules applied:
 * - No customer counts, logos, testimonials, metrics, certifications or company size.
 * - No prices, discounts, referral terms or impact numbers.
 * - Product capabilities are described as intent or by registry status, never as available.
 * - Unconfirmed facts (legal entity, mailbox, providers) use `pending` placeholders that render
 *   visibly and are counted by the dist verifier.
 */
export const en = {
  home: {
    eyebrow: 'Pre-launch',
    heading: 'Know where your organization relies on AI — and what to do when that changes.',
    lead: 'Heisterlux is being built to show which AI your organization depends on, why that reliance was considered justified, and which decisions may be affected when something shifts. So the next step can be proportionate, not improvised.',
    lineHeading: 'From visibility to action',
    lineIntro: 'Heisterlux follows one line of reasoning, from knowing what is there to knowing what to do.',
    steps: [
      { id: 'visibility', title: 'Visibility', text: 'Which AI systems and AI-enabled services are in use, where, and through which access route.' },
      { id: 'reliance', title: 'Reliance', text: 'What the organization depends on them for, how critical that is, and why it was considered acceptable.' },
      { id: 'change', title: 'Change', text: 'What shifted: a model version, the terms of access, the application around it, or the way it is used.' },
      { id: 'impact', title: 'Impact', text: 'Which applications, decisions and reliances a change may affect — and where the evidence is not enough to say.' },
      { id: 'action', title: 'Action', text: 'A suggested next step that fits the size of the change and the stakes of the reliance. People decide what to do.' },
    ],
    layersHeading: 'Four distinctions, kept explicit',
    layersIntro:
      '"We use AI for this" usually compresses several different things. Heisterlux is being built to keep these distinctions explicit, because each can change on its own.',
    layers: [
      { id: 'system', title: 'AI system or capability', text: 'The model or AI capability that produces the output.' },
      { id: 'context', title: 'Deployment Context', text: 'How your organization obtains access to that capability — for example an organization-managed licence, a personal subscription or an API agreement. It describes the access route, not where the AI appears.' },
      { id: 'application', title: 'Application or service', text: 'The product or service in which the AI capability appears or is available.' },
      { id: 'reliance', title: 'Organizational use and reliance', text: 'What the organization depends on a concrete use for — a task or decision — and why that was considered acceptable.' },
    ],
    diagram: {
      label:
        'Diagram: an organizational use and reliance rests on a concrete use. That concrete use is described by three separate things: the AI system or capability, the Deployment Context and the application or service. The three are not a chain.',
      caption: 'The three descriptors are separate. None of them determines the others, and the relationships are not one-to-one.',
      reliance: { title: 'Organizational use and reliance', sub: 'What we depend on it for, and why' },
      use: { title: 'A concrete use', sub: 'For example: drafting replies to complaints' },
      rests: 'rests on',
      describedBy: 'described by',
      parts: [
        { id: 'system', title: 'AI system or capability', sub: 'What produces the output' },
        { id: 'context', title: 'Deployment Context', sub: 'How access is obtained' },
        { id: 'application', title: 'Application or service', sub: 'Where the AI appears' },
      ],
    },
    relationsHeading: 'How they relate',
    relations: [
      'One AI capability can be available in several applications, and one application can offer several capabilities.',
      'The same capability can be reached through different Deployment Contexts, with different terms and controls.',
      'An organizational use points at the concrete combination that is actually used. It is not tied one-to-one to any single layer.',
      'A change can touch any of them. Whether it matters depends on what the organization relies on — and that is for people to judge.',
    ],
    layersNote:
      'A host application such as a word processor, a meeting tool, a mail client or a design tool is where an AI capability appears. It is not how access to it is obtained, so it is not a Deployment Context.',
    whyHeading: 'Why this matters now',
    whyItems: [
      'AI providers release new model versions and retire old ones on their own schedules.',
      'Tools your teams already use keep adding AI features, sometimes switched on by default.',
      'Terms, plans and data-handling commitments for AI services change.',
      'Use drifts: something accepted for drafts ends up supporting decisions.',
    ],
    whyClose: 'None of this is unusual. What is hard is knowing, when it happens, what it may touch.',
    brandLine: 'Confidence is earned. Not generated.',
    ctaHeading: 'Help shape Heisterlux',
    ctaText: 'We are inviting organizations to help us understand their needs before launch. Tell us how your organization uses AI.',
  },
  product: {
    heading: 'Product',
    lead: 'Heisterlux is being built as software for understanding organizational reliance on AI: what is used, what may depend on it, and what a change could mean.',
    statusNote: 'Heisterlux is in pre-launch. Nothing below is generally available yet. The roadmap shows the real status of every capability.',
    stagesHeading: 'What it is being built to do',
    forHeading: 'Who it is for',
    forItems: [
      'People responsible for how AI is used across an organization — in IT, risk, compliance, information security, data protection or operations.',
      'Organizations where AI appears in many tools and teams, not only in one central project.',
    ],
    notHeading: 'What it is not',
    notItems: [
      'Not a monitoring agent. The current scope relies on information people in your organization record; it does not scan devices, networks or employee activity. Automatic discovery is not part of the current scope and is not promised.',
      'Not a compliance certificate: it helps you understand and document reliance; it does not certify it.',
      'Not legal advice: decisions stay with your organization and its advisers.',
    ],
    roadmapLink: 'See every capability and its status',
    foundationTitle: 'Underneath',
    foundationText: 'What makes the other steps explainable later.',
  },
  howItWorks: {
    heading: 'How it works',
    lead: 'One line of reasoning — visibility, reliance, change, impact, action — built on four distinctions that Heisterlux is being built to keep explicit.',
    lineHeading: 'The line of reasoning',
    stepDetails: {
      visibility: 'Start with an honest picture: which AI systems and AI-enabled services are used, in which applications, and through which Deployment Context. In the current scope this relies on information people in the organization record. Automatic discovery is not part of it and is not promised.',
      reliance: 'For each use, record what the organization depends on it for, how critical that is, and the reason the reliance was considered justified — for example that a person reviews every output.',
      change: 'Changes can happen at any layer: a model is retired, a licence moves to another plan, an application switches on a feature, or the use itself drifts.',
      impact: 'Because the distinctions stay explicit, a change can be traced to the recorded uses it may affect. A dependency path or a model change does not by itself show that a decision is affected or no longer valid. Where evidence is missing or incomplete, that is shown as uncertainty and left to human judgement.',
      action: 'The response should fit the change and the stakes, from noting that a change was seen to reviewing a critical reliance before continuing. Heisterlux suggests; people decide.',
    },
    layersHeading: 'The four distinctions',
    exampleHeading: 'An example',
    exampleIntro: 'A support team drafts replies to complaints with AI. Described with the same four distinctions:',
    example: [
      { layer: 'AI system or capability', value: 'A general-purpose language model, in the version the vendor states.' },
      { layer: 'Deployment Context', value: 'An organization-managed licence under the company’s business agreement.' },
      { layer: 'Application or service', value: 'The helpdesk tool in which the team uses it.' },
      { layer: 'Organizational use and reliance', value: 'First drafts only; an agent approves every reply. Accepted because a person checks each one.' },
    ],
    exampleClose:
      'If the vendor retires that model version, a record like this could flag the reliance for review; whether it is actually affected is for people to judge. If the team stops reviewing drafts, the recorded reason may no longer hold — which is also a change.',
    readMore: 'Read the full article on the four layers',
  },
  roadmap: {
    heading: 'Roadmap',
    lead: 'Every capability, with the status it actually has. The same records drive the Product page and, later, release notes and documentation.',
    legendHeading: 'What the statuses mean',
    legend: {
      available: 'Released to customers in production, with defined scope, support and approval to publish. Nothing is in this state yet.',
      'in-development': 'Being built. Parts may exist in internal environments; not available to customers.',
      'up-next': 'Planned as a next step. Scope may still change.',
      exploring: 'An idea we are investigating. We may not build it, or not in this form.',
    },
    maturityNote:
      'Each card separates what is built so far in internal environments, what is still to build, and what customers can use today (so far: nothing).',
    noneAvailable: 'No capability is Available yet.',
    disclaimer:
      'This roadmap is not a commitment. Items can move between statuses or be withdrawn; withdrawals stay listed with a reason. Internal milestones such as code merges or test environments do not make a capability Available. Early customers help inform priorities, but do not buy control over the roadmap or a promise of custom development.',
    emptyGroup: 'Nothing in this status at the moment.',
    withdrawnHeading: 'Withdrawn',
  },
  trust: {
    heading: 'Trust',
    lead: 'We would rather tell you exactly what is true today than describe the company we hope to become.',
    siteHeading: 'This website',
    siteItems: [
      'No analytics, advertising, session recording or chat widgets.',
      'No third-party scripts. Fonts and images are served from this site.',
      'In our pre-launch checks this site did not set cookies or use browser storage. Behaviour of the hosting infrastructure is reviewed as part of the launch.',
      'Forms do not accept submissions yet. When they do, the privacy notice will say exactly what is collected, why, by whom and for how long.',
    ],
    principlesHeading: 'What Heisterlux is built around',
    principlesIntro:
      'For each principle we separate what we aim for, what exists today, and what must be true before launch. "Today" only describes internal foundations in development environments. None of it is available to customers, and none of it is a security or recovery guarantee.',
    principlesLegend: { principle: 'Principle', today: 'Evidenced today', before: 'Before launch' },
    nothingYet: 'Nothing is claimed as proven yet.',
    topics: [
      {
        id: 'explainability',
        title: 'Explainability',
        principle: 'A recommendation should come with its reasons: which recorded facts it rests on, which rule was applied and what is not known.',
        today: 'In an internal development environment, recommendations are derived by fixed rules from recorded facts and declarations, without a language model. No customer-facing explanation exists yet.',
        before: 'A customer-facing explanation showing facts, rule and gaps, independently tested for completeness.',
      },
      {
        id: 'evidence-provenance',
        title: 'Evidence and provenance',
        principle: 'Records should show where information came from, who recorded it and when, and keep observed use apart from formally documented use.',
        today: 'In an internal development environment, records carry their basis and recording history and are append-only.',
        before: 'Define which evidence is accepted and how provenance is shown to customers; close open findings from internal testing of the audit trail.',
      },
      {
        id: 'historical-justification',
        title: 'Historical justification',
        principle: 'The reason a reliance was accepted at the time should be kept as it was, not rewritten when circumstances change.',
        today: 'The internal foundation seals justifications so earlier versions stay intact; later changes are added alongside them.',
        before: 'Customer-facing history views and retention terms.',
      },
      {
        id: 'uncertainty',
        title: 'Uncertainty',
        principle: 'Missing, conflicting or incomplete evidence should be shown as such, not smoothed into a confident answer.',
        today: 'In the internal foundation, missing input produces "insufficient basis" instead of an invented conclusion, and conflicting or incomplete support is kept as its own state.',
        before: 'Customer-facing display of uncertainty, tested with real users.',
      },
      {
        id: 'human-authority',
        title: 'Human authority',
        principle: 'Heisterlux recommends; people and organizations decide. A recommendation is not a decision, and a decision is not enforcement.',
        today: 'The internal foundation has no mechanism that makes or enforces a decision. It does not yet verify a person’s authority to make a declaration; that is a known open design point.',
        before: 'Decide and build how authority is verified and how decisions are recorded, before customers rely on declarations.',
      },
      {
        id: 'data-ownership',
        title: 'Customer data ownership',
        principle: 'Customer data belongs to the customer. They should be able to take it out and have it deleted.',
        today: null,
        before: 'Export and deletion functionality, defined terms, data location and a subprocessor list, published before the first customer.',
      },
      {
        id: 'recoverability',
        title: 'Recoverability',
        principle: 'Customers should be able to rely on their data surviving failures. Tested recovery before the first paying customer is a hard product gate.',
        today: null,
        before: 'Tested restore, stated recovery point and recovery time objectives, export and deletion, and security measures — each with evidence. None of these is claimed today.',
      },
    ],
    claimsHeading: 'How we label product claims',
    claimsText:
      'Every capability carries one of four statuses: Available, In development, Up next or Exploring. Available requires a production release to customers, defined scope and audience, a support route and approval to publish. Code, test environments and architecture decisions do not count.',
    productHeading: 'Before the product becomes available',
    productText: 'Before the product becomes available we intend to publish, on this page:',
    productItems: [
      'where customer data is stored and processed, and by which subprocessors;',
      'how access to customer data is controlled and logged;',
      'how to report a security issue, and how we respond;',
      'the terms and data processing agreement that apply.',
    ],
    noCertifications: 'Heisterlux does not currently hold security or AI management certifications, and does not claim to.',
    securityHeading: 'Reporting a security issue',
    securityPending: 'Heisterlux security contact',
  },
  pricing: {
    heading: 'Pricing',
    lead: 'Heisterlux is in pre-launch and pricing has not been set yet.',
    body: [
      'Pricing has not been decided. We intend to publish it here before Heisterlux becomes generally available.',
      'If pricing matters for your decision, tell us through the early access page. We will say what we know and what we do not know yet.',
    ],
    impactHeading: 'A principle we intend to keep',
    impactQuote: 'Better AI governance shouldn’t be limited to organizations with the largest budgets.',
    impactNote: 'This is an intention, not a programme. No discount or access scheme is running, and none is promised here.',
  },
  resources: {
    heading: 'Resources',
    lead: 'Careful explanations about AI reliance and AI change. Each article lists its primary sources, its limitations and when it was last reviewed.',
    readArticle: 'Read article',
  },
  earlyAccess: {
    heading: 'Early access',
    lead: 'Before launch we are inviting organizations to help us understand their needs, so that Heisterlux fits how AI is really used.',
    whatHeading: 'What early access means',
    whatItems: [
      'We may contact you to understand how your organization uses AI today.',
      'We may invite some organizations to try parts of Heisterlux before launch, when those parts are ready. No programme or access is promised yet.',
      'Early customers help inform priorities, but do not buy control over the roadmap or a promise of custom development.',
      'There is no obligation and no cost to ask.',
      'Asking for early access does not sign you up for news or marketing email.',
    ],
    formHeading: 'Request early access',
    keepHeading: 'Keep me informed',
    keepText: 'Only want to hear when Heisterlux launches? Leave your email. We will ask you to confirm it first.',
  },
  about: {
    heading: 'About Heisterlux',
    lead: 'Heisterlux exists because organizations increasingly depend on AI they did not build, cannot fully see and do not control.',
    body: [
      'Most organizations did not decide to "adopt AI" once. It arrived through many doors: a feature in a familiar tool, a licence one team bought, a personal account someone found useful. Each of those can be reasonable. Together, they are hard to see — and harder to reason about when something changes.',
      'Heisterlux is being built to make that reliance visible and explainable, so that changes can be met with a proportionate response instead of guesswork.',
    ],
    principlesHeading: 'Principles',
    principles: [
      { title: 'Earned confidence', text: 'Confidence should come from evidence you can inspect, not from a score we generate.' },
      { title: 'Proportionate', text: 'Most changes need a note, not a meeting. Some need a careful review. The response should fit.' },
      { title: 'Honest status', text: 'We say what exists, what is being built and what is only an idea — and keep that history visible.' },
      { title: 'Your judgement', text: 'Heisterlux supports decisions; it does not make them for you.' },
    ],
  },
  contact: {
    heading: 'Contact',
    lead: 'We are setting up our email and processing arrangements.',
    mailboxPending: 'Heisterlux contact email address',
    formHeading: 'Send a message',
    alternative: 'For early access, use the early access page instead.',
  },
  privacy: {
    heading: 'Privacy',
    draftNotice: 'Draft — this notice has not been legally reviewed and will be completed before launch.',
    sections: [
      {
        anchor: 'who',
        heading: 'Who is responsible',
        text: 'The controller for personal data processed through this website is:',
        pending: 'legal entity name, registered address and registration number',
      },
      {
        anchor: 'visiting',
        heading: 'Visiting this website',
        text: 'This website does not use analytics, advertising, session recording or third-party scripts, and does not itself set cookies or use browser storage. Like any website, our hosting provider processes technical data such as IP addresses to deliver pages and protect against abuse.',
        pending: 'hosting provider, region and log retention period',
      },
      {
        anchor: 'forms',
        heading: 'Forms',
        text: 'The early access, keep-me-informed and contact forms do not accept submissions yet. Before they do, this section will describe for each form: the data collected, the purpose, the legal basis, the email provider that processes it, where it is stored and how long it is kept. "Keep me informed" will require your explicit consent and a confirmation email (double opt-in). Requesting early access or sending a message will not sign you up for news.',
        pending: 'email provider, processing region, retention periods and legal bases',
      },
      {
        anchor: 'rights',
        heading: 'Your rights',
        text: 'You have the right to access, correct and delete your personal data, to object to or restrict processing, to data portability, and to withdraw consent at any time. You also have the right to lodge a complaint with a data protection supervisory authority.',
        pending: 'contact address for privacy requests and the competent supervisory authority',
      },
    ],
  },
  legal: {
    heading: 'Legal',
    draftNotice: 'Draft — this page has not been legally reviewed and will be completed before launch.',
    sections: [
      { anchor: 'company', heading: 'Company information', text: 'This website is operated by:', pending: 'legal entity name, registered address, registration number and VAT number' },
      {
        anchor: 'use',
        heading: 'Use of this website',
        text: 'The information on this website is provided for general information. It is not legal advice. Product descriptions reflect the status shown on the roadmap on the date of review and may change.',
        pending: null,
      },
      { anchor: 'trademarks', heading: 'Names and trademarks', text: 'Product and company names of third parties mentioned in resources belong to their respective owners and are mentioned for identification only.', pending: null },
    ],
  },
  forms: {
    labels: {
      email: 'Work email',
      organization: 'Organization',
      role: 'Your role',
      useCase: 'How does your organization use AI today?',
      updatesConsent: 'Also keep me informed about the Heisterlux launch. I will receive an email to confirm this.',
      consent: 'Yes, email me about the Heisterlux launch. I can unsubscribe at any time.',
      message: 'Message',
    },
    // Hints state the purpose of each field for that specific form.
    hints: {
      'early-access': {
        email: 'We use this to reply to your early access request.',
        useCase: 'A few sentences is plenty. Please do not include confidential information.',
      },
      'keep-informed': {
        email: 'We use this to send you a confirmation email. Only if you confirm it do we use it for launch updates.',
      },
      contact: {
        email: 'We use this to reply to your message.',
        message: 'Please do not include confidential information.',
      },
    },
    honeypotLabel: 'Leave this field empty',
    submit: {
      'early-access': 'Request early access',
      'keep-informed': 'Keep me informed',
      contact: 'Send message',
    },
    errors: {
      required: 'This field is required.',
      'too-long': 'This is too long.',
      'too-short': 'Please write a little more.',
      'invalid-email': 'Enter an email address like name@example.com.',
      'invalid-value': 'This value is not valid.',
    },
    results: {
      acceptedTitle: 'Thank you',
      accepted: {
        'early-access': 'We have received your request. If we can work together, we will get in touch.',
        'keep-informed': 'Please check your inbox and confirm your email address. You will only hear from us after you confirm.',
        contact: 'We have received your message and will reply by email.',
      },
      acceptedConfirm: 'You asked to be kept informed: please check your inbox and confirm your email address first.',
      disabledTitle: 'Submissions are not open yet',
      disabled: 'This form is not accepting submissions yet, and your submission was not processed. Please try again after launch.',
      invalidTitle: 'Please check the form',
      rateLimitedTitle: 'Too many attempts',
      rateLimited: 'Please wait a few minutes before trying again.',
      badRequestTitle: 'This submission could not be processed',
      badRequest: 'Please go back to the form and try again.',
      providerErrorTitle: 'We could not confirm your submission',
      providerError: 'We could not confirm whether your submission was received. Please try again a little later.',
    },
  },
  notFound: {
    heading: 'Page not found',
    text: 'The page you were looking for does not exist, or has moved.',
    butler: 'Our sloth butler looked everywhere. Slowly, and thoroughly.',
    home: 'Go to the home page',
  },
} as const;

type Widen<T> = T extends string ? string : T extends null ? string | null : { [K in keyof T]: Widen<T[K]> };
export type PageCopy = Widen<typeof en>;
