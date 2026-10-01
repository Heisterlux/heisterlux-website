import { ORGANIZATION_NAME, SITE_ORIGIN } from '../config/site.ts';
import { DEFAULT_LOCALE, getLocale, type LocaleCode } from '../i18n/locales.ts';
import { alternatesFor } from '../content/routes.ts';

/**
 * SEO helpers. Structured data describes only verifiable facts: no ratings, reviews, offers,
 * prices, certifications, logos we do not have, or organization size.
 */

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

/**
 * hreflang only between published translations of the same page, always reciprocal because every
 * translation derives its set from the same registry entry. x-default points to the English page.
 * Pages that exist in a single locale still list themselves plus x-default.
 */
export function hreflangFor(routeId: string): HreflangLink[] {
  const alternates = alternatesFor(routeId);
  const links = alternates.map((a) => ({ hreflang: getLocale(a.locale)!.bcp47, href: absoluteUrl(a.path) }));
  const xDefault = alternates.find((a) => a.locale === DEFAULT_LOCALE);
  if (xDefault) links.push({ hreflang: 'x-default', href: absoluteUrl(xDefault.path) });
  return links;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: ORGANIZATION_NAME,
    url: `${SITE_ORIGIN}/`,
    slogan: 'Confidence is earned. Not generated.',
  };
}

export function websiteJsonLd(locale: LocaleCode): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: ORGANIZATION_NAME,
    url: `${SITE_ORIGIN}/`,
    inLanguage: getLocale(locale)!.bcp47,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

export function webPageJsonLd(opts: {
  path: string;
  title: string;
  description: string;
  locale: LocaleCode;
  datePublished: string;
  dateModified: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
}): Record<string, unknown> {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: getLocale(opts.locale)!.bcp47,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
  };
}

export function articleJsonLd(opts: {
  path: string;
  title: string;
  description: string;
  locale: LocaleCode;
  datePublished: string;
  dateModified: string;
  citations: string[];
}): Record<string, unknown> {
  return {
    '@type': 'Article',
    '@id': `${absoluteUrl(opts.path)}#article`,
    mainEntityOfPage: absoluteUrl(opts.path),
    headline: opts.title,
    description: opts.description,
    inLanguage: getLocale(opts.locale)!.bcp47,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: { '@id': `${SITE_ORIGIN}/#organization` },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    citation: opts.citations,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function graph(nodes: Record<string, unknown>[]): string {
  // Escape "<" so the JSON can never terminate the <script> element.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
