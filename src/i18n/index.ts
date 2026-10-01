import { getLocale, type LocaleCode } from './locales.ts';
import { en, type UiDictionary } from './ui/en.ts';

/**
 * UI dictionaries per locale. A locale that is not published may be missing here;
 * `ui()` throws instead of falling back to English, so a missing translation fails the build.
 */
const DICTIONARIES: Partial<Record<LocaleCode, UiDictionary>> = { en };

export function ui(locale: LocaleCode): UiDictionary {
  const dict = DICTIONARIES[locale];
  if (!dict) throw new Error(`No UI dictionary for locale "${locale}" (no silent fallback).`);
  return dict;
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

function bcp47(locale: LocaleCode): string {
  return getLocale(locale)?.bcp47 ?? locale;
}

/** Formats an ISO date (YYYY-MM-DD) for display, in UTC so build machines agree. */
export function formatDate(locale: LocaleCode, isoDate: string): string {
  return new Intl.DateTimeFormat(bcp47(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatNumber(locale: LocaleCode, value: number): string {
  return new Intl.NumberFormat(bcp47(locale)).format(value);
}
