import type { APIRoute } from 'astro';
import { INDEXABLE, SITE_ORIGIN } from '../config/site.ts';

export const prerender = true;

/** Preview/DEV builds disallow everything. noindex/robots are not access control. */
export const GET: APIRoute = () => {
  const body = INDEXABLE
    ? `User-agent: *\nAllow: /\nDisallow: /en/submit/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
