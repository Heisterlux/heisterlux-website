import { DEFAULT_LOCALE, PUBLISHED_LOCALES, type LocaleCode } from '../i18n/locales.ts';
import { RESOURCES, type ResourceArticle } from './resources/index.ts';
import { RELEASES } from './releases.ts';

/**
 * Central route registry.
 *
 * Every page has a stable content ID. Each locale supplies its own slug and metadata.
 * A page exists under /{locale}/ only if the locale is published AND the page has an entry
 * for that locale AND the page is enabled. Links are resolved through `pathFor`, which throws
 * for anything that would not exist — so a broken internal link fails the build.
 */

export type PageKind =
  | 'home'
  | 'product'
  | 'how-it-works'
  | 'roadmap'
  | 'trust'
  | 'pricing'
  | 'resources'
  | 'resource-article'
  | 'early-access'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'legal'
  | 'changelog'
  | 'release-notes'
  | 'documentation';

/**
 * Copy provenance. Nothing on this site comes from an approved WEB-001A/B/C source — none was
 * found during recovery — so all copy is `new-draft` until reviewed.
 */
export type CopyStatus = 'new-draft' | 'reviewed' | 'approved';

export interface LocalizedMeta {
  slug: string;
  title: string;
  /** Short label for navigation; defaults to title. */
  navLabel?: string;
  description: string;
}

export interface RouteDef {
  id: string;
  kind: PageKind;
  nav?: 'primary' | 'secondary';
  /** Stable content ID of the resource article (for kind 'resource-article'). */
  articleId?: string;
  datePublished: string;
  dateReviewed: string;
  copyStatus: CopyStatus;
  locales: Partial<Record<LocaleCode, LocalizedMeta>>;
  /** Models exist but routes stay invisible until real content exists. */
  enabled: boolean;
}

const D = '2026-09-30';

const STATIC_ROUTES: RouteDef[] = [
  {
    id: 'home', kind: 'home', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: '',
        title: 'Heisterlux — Know where your organization relies on AI',
        navLabel: 'Home',
        description:
          'Heisterlux helps organizations see where they rely on AI, why that reliance was justified, and what to do when an AI system, its terms or its use changes.',
      },
    },
  },
  {
    id: 'product', kind: 'product', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'product',
        title: 'Product',
        description:
          'What Heisterlux is being built to do: make AI reliance visible, explain it, detect relevant change and point to a proportionate next step.',
      },
    },
  },
  {
    id: 'how-it-works', kind: 'how-it-works', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'how-it-works',
        title: 'How it works',
        description:
          'Visibility, reliance, change, impact, action — and the four layers Heisterlux keeps apart: AI system, Deployment Context, application and organizational reliance.',
      },
    },
  },
  {
    id: 'roadmap', kind: 'roadmap', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'roadmap',
        title: 'Roadmap',
        description:
          'Every Heisterlux capability with its real status — Available, In development, Up next or Exploring — including scope, limitations and review date.',
      },
    },
  },
  {
    id: 'trust', kind: 'trust', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'trust',
        title: 'Trust',
        description:
          'What this website does and does not do with your data, how we label product claims, and what we will publish before the product becomes available.',
      },
    },
  },
  {
    id: 'pricing', kind: 'pricing', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'pricing',
        title: 'Pricing',
        description: 'Heisterlux is in pre-launch. Pricing has not been set yet; this page explains what we can say today.',
      },
    },
  },
  {
    id: 'resources', kind: 'resources', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'resources',
        title: 'Resources',
        description:
          'Careful explanations about AI reliance and AI change, with primary sources, stated limitations and review dates.',
      },
    },
  },
  {
    id: 'early-access', kind: 'early-access', nav: 'primary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: {
        slug: 'early-access',
        title: 'Early access',
        description: 'Ask to take part in Heisterlux early access, or ask to be kept informed about the launch.',
      },
    },
  },
  {
    id: 'about', kind: 'about', nav: 'secondary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: { slug: 'about', title: 'About', description: 'Why Heisterlux exists and the principles it is built on.' },
    },
  },
  {
    id: 'contact', kind: 'contact', nav: 'secondary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: { slug: 'contact', title: 'Contact', description: 'How to reach Heisterlux, and the status of our contact channels during pre-launch.' },
    },
  },
  {
    id: 'privacy', kind: 'privacy', nav: 'secondary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: { slug: 'privacy', title: 'Privacy', description: 'How this website handles personal data. Draft pending legal review.' },
    },
  },
  {
    id: 'legal', kind: 'legal', nav: 'secondary', datePublished: D, dateReviewed: D, copyStatus: 'new-draft', enabled: true,
    locales: {
      en: { slug: 'legal', title: 'Legal', description: 'Legal information about this website. Draft pending legal review.' },
    },
  },
  // Prepared models. Invisible until real content exists.
  {
    id: 'changelog', kind: 'changelog', datePublished: D, dateReviewed: D, copyStatus: 'new-draft',
    enabled: RELEASES.some((r) => r.kind === 'customer-release'),
    locales: { en: { slug: 'changelog', title: 'Changelog', description: 'Customer-facing changes to Heisterlux.' } },
  },
  {
    id: 'release-notes', kind: 'release-notes', datePublished: D, dateReviewed: D, copyStatus: 'new-draft',
    enabled: RELEASES.some((r) => r.kind === 'customer-release' && r.notes !== undefined),
    locales: { en: { slug: 'release-notes', title: 'Release notes', description: 'Detailed notes per Heisterlux release.' } },
  },
  {
    id: 'documentation', kind: 'documentation', datePublished: D, dateReviewed: D, copyStatus: 'new-draft',
    enabled: false,
    locales: { en: { slug: 'docs', title: 'Documentation', description: 'Product documentation for Heisterlux.' } },
  },
];

/** One route per resource article; a draft article (published: false) gets a disabled route. */
export function buildResourceRoutes(articles: readonly ResourceArticle[]): RouteDef[] {
  return articles.map((article) => ({
    id: `resource:${article.id}`,
    kind: 'resource-article' as const,
    articleId: article.id,
    datePublished: article.datePublished,
    dateReviewed: article.dateReviewed,
    copyStatus: article.copyStatus,
    enabled: article.published,
    locales: Object.fromEntries(
      Object.entries(article.locales).map(([locale, content]) => [
        locale,
        { slug: `resources/${content.slug}`, title: content.title, description: content.description },
      ]),
    ),
  }));
}

const RESOURCE_ROUTES: RouteDef[] = buildResourceRoutes(RESOURCES);

export const ROUTES: readonly RouteDef[] = [...STATIC_ROUTES, ...RESOURCE_ROUTES];

// ---- Validation at module load: duplicate IDs or slugs fail the build. ----
{
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const r of ROUTES) {
    if (ids.has(r.id)) throw new Error(`Duplicate route id: ${r.id}`);
    ids.add(r.id);
    for (const [locale, meta] of Object.entries(r.locales)) {
      if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$|^$/.test(meta.slug)) throw new Error(`Invalid slug "${meta.slug}" (${r.id})`);
      const p = `/${locale}/${meta.slug}`;
      if (paths.has(p)) throw new Error(`Duplicate path: ${p}`);
      paths.add(p);
    }
  }
  if (!ROUTES.find((r) => r.id === 'home')?.locales[DEFAULT_LOCALE]) {
    throw new Error('The default locale must have a home page (x-default target).');
  }
}

export function getRoute(id: string): RouteDef {
  const route = ROUTES.find((r) => r.id === id);
  if (!route) throw new Error(`Unknown route id: ${id}`);
  return route;
}

function buildPath(locale: LocaleCode, slug: string): string {
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

/** True when the page is actually generated for that locale. */
export function isLive(route: RouteDef, locale: LocaleCode): boolean {
  return route.enabled && PUBLISHED_LOCALES.some((l) => l.code === locale) && route.locales[locale] !== undefined;
}

/** Resolves an internal link. Throws when the target page does not exist in that locale. */
export function pathFor(id: string, locale: LocaleCode): string {
  const route = getRoute(id);
  const meta = route.locales[locale];
  if (!meta || !isLive(route, locale)) {
    throw new Error(`Link to "${id}" in "${locale}" would be broken: page is not published in that locale.`);
  }
  return buildPath(locale, meta.slug);
}

export function metaFor(id: string, locale: LocaleCode): LocalizedMeta {
  const meta = getRoute(id).locales[locale];
  if (!meta) throw new Error(`No "${locale}" metadata for "${id}" (no silent fallback).`);
  return meta;
}

/** Published translations of a page (including itself), for hreflang and the language selector. */
export function alternatesFor(id: string): { locale: LocaleCode; path: string }[] {
  const route = getRoute(id);
  return PUBLISHED_LOCALES.filter((l) => isLive(route, l.code)).map((l) => ({
    locale: l.code,
    path: buildPath(l.code, route.locales[l.code]!.slug),
  }));
}

/** Every generated page. Drives getStaticPaths and the sitemap. */
export function livePages(): { route: RouteDef; locale: LocaleCode; slug: string; path: string }[] {
  const pages: { route: RouteDef; locale: LocaleCode; slug: string; path: string }[] = [];
  for (const route of ROUTES) {
    for (const l of PUBLISHED_LOCALES) {
      if (!isLive(route, l.code)) continue;
      const slug = route.locales[l.code]!.slug;
      pages.push({ route, locale: l.code, slug, path: buildPath(l.code, slug) });
    }
  }
  return pages;
}

export function navRoutes(kind: 'primary' | 'secondary', locale: LocaleCode): { id: string; label: string; path: string }[] {
  return ROUTES.filter((r) => r.nav === kind && isLive(r, locale)).map((r) => {
    const meta = r.locales[locale]!;
    return { id: r.id, label: meta.navLabel ?? meta.title, path: buildPath(locale, meta.slug) };
  });
}
