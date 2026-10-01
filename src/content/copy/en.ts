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
    lead: 'Heisterlux is being built to show which AI your organization depends on, why that reliance was considered justified, and which decisions are affected when something shifts. So the next step is proportionate, not improvised.',
    lineHeading: 'From visibility to action',
    lineIntro: 'Heisterlux follows one line of reasoning, from knowing what is there to knowing what to do.',
    steps: [
      { id: 'visibility', title: 'Visibility', text: 'Which AI systems and AI-enabled services are in use, where, and through which access route.' },
      { id: 'reliance', title: 'Reliance', text: 'What the organization depends on them for, how critical that is, and why it was considered acceptable.' },
      { id: 'change', title: 'Change', text: 'What shifted: a model version, the terms of access, the application around it, or the way it is used.' },
      { id: 'impact', title: 'Impact', text: 'Which applications, decisions and reliances the change can affect — and which it cannot.' },
      { id: 'action', title: 'Action', text: 'A next step that fits the size of the change and the stakes of the reliance.' },
    ],
    layersHeading: 'Four layers, kept apart',
    layersIntro:
      '"We use AI for this" usually compresses four different things. Heisterlux records them separately, because each can change on its own.',
    layers: [
      { id: 'system', title: 'AI system', text: 'The model or AI capability that produces the output.' },
      { id: 'context', title: 'Deployment Context', text: 'How your organization obtains access to it — for example an organization-managed licence, a personal subscription or an API agreement.' },
      { id: 'application', title: 'Application', text: 'The product or service in which the AI appears.' },
      { id: 'reliance', title: 'Reliance', text: 'The task or decision the organization depends on it for, and why.' },
    ],
    layerConnectors: ['accessed through', 'appears in', 'relied on for'],
    layersNote:
      'A host application such as a word processor, a meeting tool, a mail client or a design tool is where AI appears. It is not how the AI is accessed, so it is not a Deployment Context.',
    whyHeading: 'Why this matters now',
    whyItems: [
      'AI providers release new model versions and retire old ones on their own schedules.',
      'Tools your teams already use keep adding AI features, sometimes switched on by default.',
      'Terms, plans and data-handling commitments for AI services change.',
      'Use drifts: something accepted for drafts ends up supporting decisions.',
    ],
    whyClose: 'None of this is unusual. What is hard is knowing, when it happens, what it touches.',
    brandLine: 'Confidence is earned. Not generated.',
    ctaHeading: 'Help shape Heisterlux',
    ctaText: 'We are working with a small number of organizations before launch. Tell us how your organization uses AI.',
  },
  product: {
    heading: 'Product',
    lead: 'Heisterlux is software for understanding organizational reliance on AI: what you use, what depends on it, and what a change means for you.',
    statusNote: 'Heisterlux is in pre-launch. Nothing below is generally available yet. The roadmap shows the real status of every capability.',
    stagesHeading: 'What it is being built to do',
    forHeading: 'Who it is for',
    forItems: [
      'People responsible for how AI is used across an organization — in IT, risk, compliance, information security, data protection or operations.',
      'Organizations where AI appears in many tools and teams, not only in one central project.',
    ],
    notHeading: 'What it is not',
    notItems: [
      'Not a monitoring agent: Heisterlux does not scan devices, networks or employee activity.',
      'Not a compliance certificate: it helps you understand and document reliance; it does not certify it.',
      'Not legal advice: decisions stay with your organization and its advisers.',
    ],
    roadmapLink: 'See every capability and its status',
    foundationTitle: 'Underneath',
    foundationText: 'What makes the other steps explainable later.',
  },
  howItWorks: {
    heading: 'How it works',
    lead: 'One line of reasoning — visibility, reliance, change, impact, action — applied to four layers that are kept apart.',
    lineHeading: 'The line of reasoning',
    stepDetails: {
      visibility: 'Start with an honest picture: which AI systems and AI-enabled services are used, in which applications, and through which Deployment Context. Heisterlux relies on people recording this; it does not scan.',
      reliance: 'For each use, record what the organization depends on it for, how critical that is, and the reason the reliance was considered justified — for example that a person reviews every output.',
      change: 'Changes can happen at any layer: a model is retired, a licence moves to another plan, an application switches on a feature, or the use itself drifts.',
      impact: 'Because the layers are linked but separate, a change can be traced to the uses and decisions it can affect — and ruled out for the ones it cannot.',
      action: 'The response should fit the change and the stakes: from noting that a change was seen, to reviewing a critical reliance before continuing.',
    },
    layersHeading: 'The four layers',
    exampleHeading: 'An example',
    exampleIntro: 'A support team drafts replies to complaints with AI. Recorded in four layers:',
    example: [
      { layer: 'AI system', value: 'A general-purpose language model, in the version the vendor states.' },
      { layer: 'Deployment Context', value: 'An organization-managed licence under the company’s business agreement.' },
      { layer: 'Application', value: 'The helpdesk tool the team works in.' },
      { layer: 'Reliance', value: 'First drafts only; an agent approves every reply. Accepted because a person checks each one.' },
    ],
    exampleClose:
      'If the vendor retires that model version, the change points straight to this reliance. If the team stops reviewing drafts, the recorded reason no longer holds — which is also a change.',
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
    noneAvailable: 'No capability is Available yet.',
    disclaimer:
      'This roadmap is not a commitment. Items can move between statuses or be withdrawn; withdrawals stay listed with a reason. Internal milestones such as code merges or test environments do not make a capability Available.',
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
      'This site does not set cookies or use browser storage itself. We check this before each release; hosting infrastructure behaviour is reviewed as part of the launch.',
      'Forms do not accept submissions yet. When they do, the privacy notice will say exactly what is collected, why, by whom and for how long.',
    ],
    claimsHeading: 'How we label product claims',
    claimsText:
      'Every capability carries one of four statuses: Available, In development, Up next or Exploring. Available requires a production release to customers, defined scope and audience, a support route and approval to publish. Code, test environments and architecture decisions do not count.',
    productHeading: 'Before the product becomes available',
    productText: 'We will publish, on this page:',
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
      'We are working out pricing together with organizations in early access. We will publish it here before Heisterlux becomes generally available.',
      'If pricing matters for your decision now, ask us through early access. We will tell you what we know, and what we do not know yet.',
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
    lead: 'Before launch we are working with a small number of organizations to make sure Heisterlux fits how AI is really used.',
    whatHeading: 'What early access means',
    whatItems: [
      'We may contact you to understand how your organization uses AI today.',
      'You may get to try parts of Heisterlux before launch, when they are ready.',
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
    hints: {
      email: 'We only use this to reply to you.',
      useCase: 'A few sentences is plenty. Please do not include confidential information.',
      message: 'Please do not include confidential information.',
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
      disabled: 'This form is not accepting submissions yet. Nothing you entered was sent or stored.',
      invalidTitle: 'Please check the form',
      rateLimitedTitle: 'Too many attempts',
      rateLimited: 'Please wait a few minutes before trying again.',
      badRequestTitle: 'This submission could not be processed',
      badRequest: 'Please go back to the form and try again.',
      providerErrorTitle: 'Something went wrong on our side',
      providerError: 'Your submission could not be completed. Nothing was sent. Please try again later.',
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
