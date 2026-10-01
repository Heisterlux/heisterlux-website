import type { APIRoute } from 'astro';
import { livePages } from '../content/routes.ts';
import { absoluteUrl, hreflangFor } from '../lib/seo.ts';

export const prerender = true;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Sitemap of every generated page, with hreflang alternates from the same registry. */
export const GET: APIRoute = () => {
  const urls = livePages()
    .map((p) => {
      const alternates = hreflangFor(p.route.id)
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${esc(l.hreflang)}" href="${esc(l.href)}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${esc(absoluteUrl(p.path))}</loc>\n    <lastmod>${p.route.dateReviewed}</lastmod>\n${alternates}\n  </url>`;
    })
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
