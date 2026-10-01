/** English UI dictionary. Every other locale must provide the same keys (enforced by type). */
export const en = {
  skipToContent: 'Skip to content',
  primaryNav: 'Primary',
  footerNav: 'Footer',
  footerMore: 'More',
  signIn: 'Sign in',
  menu: 'Menu',
  home: 'Heisterlux home',
  language: 'Language',
  currentLanguage: 'Current language',
  breadcrumb: 'Breadcrumb',
  earlyAccessCta: 'Request early access',
  howItWorksCta: 'See how it works',
  preLaunch: 'Pre-launch',
  preLaunchNote:
    'Heisterlux is not generally available yet. Every capability on this site is labelled with its actual status.',
  published: 'Published',
  reviewed: 'Last reviewed',
  sources: 'Sources',
  limitations: 'Limitations',
  onThisPage: 'On this page',
  status: 'Status',
  scope: 'Scope',
  builtSoFar: 'Built so far (internal)',
  stillToBuild: 'Still to build',
  customerToday: 'Customer use today',
  notAvailable: 'Not available',
  pendingPrefix: 'To be confirmed before launch:',
  footerTagline: 'Confidence is earned. Not generated.',
  footerCopyright: '© {year} Heisterlux',
  diagramTextHeading: 'The same diagram, as text',
  notFoundTitle: 'Page not found',
  // Forms
  formRequired: 'required',
  formOptional: 'optional',
  formSubmit: 'Send',
  formErrorSummary: 'There is a problem with your submission',
  formsDisabledTitle: 'Submissions are not open yet',
  formsDisabledBody:
    'This form is not accepting submissions yet. We are still setting up email, privacy and processing arrangements. Please come back after launch; submitting this form does nothing for now.',
  formsSandboxNotice:
    'Local test mode: submissions go to an in-memory test simulator on this machine. No real provider is used and no real email is sent.',
  backToForm: 'Back to the form',
  capabilityStatus: {
    available: 'Available',
    'in-development': 'In development',
    'up-next': 'Up next',
    exploring: 'Exploring',
  },
} as const;

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type UiDictionary = Widen<typeof en>;
