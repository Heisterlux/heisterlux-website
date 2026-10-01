/**
 * Site-wide configuration. Values here are facts about the deployment, not marketing copy.
 * Anything that is not yet confirmed is `null` and must render as "not available" — never invented.
 */

export const SITE_ORIGIN = 'https://heisterlux.com';
export const ORGANIZATION_NAME = 'Heisterlux';

/**
 * Verified, publicly usable production sign-in URL for the product.
 * Must stay null until a production login exists and is approved for customers (launch gate G-SIGNIN).
 * DEV (dev.heisterlux.com) is never a customer destination.
 */
export const SIGN_IN_URL: string | null = null;

/** Confirmed Heisterlux mailbox. Not set up yet (launch gate G-MAIL). */
export const CONTACT_EMAIL: string | null = null;

/** Security contact for responsible disclosure. Not set up yet (launch gate G-MAIL). */
export const SECURITY_EMAIL: string | null = null;

/**
 * Indexing requires an explicit release decision AND a Vercel production build.
 * Preview and DEV builds are always noindex. noindex is not access control.
 */
export const INDEXABLE: boolean =
  process.env.VERCEL_ENV === 'production' && process.env.PUBLIC_SITE_INDEXABLE === 'true';
