import type { CopyStatus } from '../routes.ts';
import { en as fourLayersEn } from './four-layers.en.ts';
import { en as whenAiChangesEn } from './when-ai-changes.en.ts';
import { en as aiLiteracyEn } from './ai-literacy-eu.en.ts';

/**
 * Resource articles. Each has a stable ID, per-locale content with its own slug, primary sources,
 * explicit limitations and a review date. No generic filler content.
 */

export interface ResourceSource {
  title: string;
  publisher: string;
  url: string;
  /** Date the source was last checked for this article (YYYY-MM-DD). */
  checkedOn: string;
}

export interface ResourceSection {
  /** Stable anchor; do not change once published. */
  anchor: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface ResourceContent {
  slug: string;
  title: string;
  description: string;
  summary: string;
  sections: ResourceSection[];
  limitations: string[];
  sources: ResourceSource[];
}

export interface ResourceArticle {
  id: string;
  /**
   * false = kept as a draft: no route, no navigation entry, no sitemap entry, no listing, no hreflang.
   * Use it when a statement cannot be verified against a primary source; other articles are unaffected.
   */
  published: boolean;
  datePublished: string;
  dateReviewed: string;
  copyStatus: CopyStatus;
  locales: Partial<Record<'en' | 'nl' | 'de', ResourceContent>>;
}

export const RESOURCES: readonly ResourceArticle[] = [
  { id: 'four-layers', published: true, datePublished: '2026-09-30', dateReviewed: '2026-09-30', copyStatus: 'new-draft', locales: { en: fourLayersEn } },
  { id: 'when-ai-changes', published: true, datePublished: '2026-09-30', dateReviewed: '2026-09-30', copyStatus: 'new-draft', locales: { en: whenAiChangesEn } },
  { id: 'ai-literacy-eu', published: true, datePublished: '2026-09-30', dateReviewed: '2026-10-01', copyStatus: 'new-draft', locales: { en: aiLiteracyEn } },
];

{
  for (const a of RESOURCES) {
    for (const [locale, c] of Object.entries(a.locales)) {
      if (c.sources.length === 0) throw new Error(`Resource ${a.id}/${locale} has no sources`);
      if (c.limitations.length === 0) throw new Error(`Resource ${a.id}/${locale} has no limitations`);
      // Ids the article template renders itself; section anchors must not collide with them.
      const anchors = new Set<string>(['limitations', 'sources', 'toc-heading', 'main']);
      for (const s of c.sections) {
        if (anchors.has(s.anchor)) throw new Error(`Duplicate anchor ${s.anchor} in ${a.id}/${locale}`);
        anchors.add(s.anchor);
      }
      for (const s of c.sources) {
        if (!s.url.startsWith('https://')) throw new Error(`Source must be https: ${s.url}`);
      }
    }
  }
}
