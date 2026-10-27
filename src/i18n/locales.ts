/**
 * Central locale registry.
 *
 * A locale is only routable when `published` is true. Unpublished locales are declared so that
 * slugs, dictionaries and content can be prepared and reviewed, but they never produce URLs,
 * hreflang entries or sitemap entries. There is no silent English fallback under another locale.
 */

export type LocaleCode = 'en' | 'nl' | 'de';

export interface LocaleDefinition {
  code: LocaleCode;
  /** BCP 47 tag used for <html lang>, hreflang and Intl. */
  bcp47: string;
  /** Name of the language in that language (used by the language selector). */
  nativeName: string;
  dir: 'ltr' | 'rtl';
  published: boolean;
}

export const LOCALES: readonly LocaleDefinition[] = [
  { code: 'en', bcp47: 'en', nativeName: 'English', dir: 'ltr', published: true },
  { code: 'nl', bcp47: 'nl', nativeName: 'Nederlands', dir: 'ltr', published: false },
  { code: 'de', bcp47: 'de', nativeName: 'Deutsch', dir: 'ltr', published: false },
];

/** The x-default target and the locale the root URL redirects to. */
export const DEFAULT_LOCALE: LocaleCode = 'en';

export const PUBLISHED_LOCALES: readonly LocaleDefinition[] = LOCALES.filter((l) => l.published);

export function getLocale(code: string): LocaleDefinition | undefined {
  return LOCALES.find((l) => l.code === code);
}

export function isPublishedLocale(code: string): code is LocaleCode {
  return PUBLISHED_LOCALES.some((l) => l.code === code);
}
