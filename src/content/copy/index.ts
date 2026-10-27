import type { LocaleCode } from '../../i18n/locales.ts';
import { en, type PageCopy } from './en.ts';

const COPY: Partial<Record<LocaleCode, PageCopy>> = { en };

/** Page copy for a locale. Throws rather than falling back to English. */
export function copy(locale: LocaleCode): PageCopy {
  const c = COPY[locale];
  if (!c) throw new Error(`No page copy for locale "${locale}" (no silent fallback).`);
  return c;
}
