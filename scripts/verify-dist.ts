/**
 * Post-build verification of the deployable artifact (.vercel/output).
 * Run after `astro build`: `node scripts/verify-dist.ts [--json evidence.json] [--launch]`.
 *
 * Checks: internal links, one h1, title/description, self-canonical, hreflang reciprocity and
 * x-default, html lang/dir, robots meta, JSON-LD validity and forbidden types, inline
 * scripts/handlers, external resources, legacy remnants, CSP per route, size budgets and
 * pending (unconfirmed) items. With --launch, pending items and noindex fail the run.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { findClaimViolations } from './claim-lint.ts';

const OUT = '.vercel/output';
const STATIC = join(OUT, 'static');
const ORIGIN = 'https://heisterlux.com';
const args = process.argv.slice(2);
const launch = args.includes('--launch');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : undefined;

const BUDGET = { jsGzip: 30 * 1024, cssGzip: 50 * 1024, initialTransfer: 500 * 1024, fonts: 100 * 1024 };

const errors: string[] = [];
const warnings: string[] = [];
const fail = (m: string) => errors.push(m);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(STATIC)) {
  console.error(`No build output at ${STATIC}. Run "npm run build" first.`);
  process.exit(1);
}

const files = walk(STATIC);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const urlOf = (f: string) => {
  const rel = '/' + relative(STATIC, f).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};
const existing = new Set(files.map((f) => '/' + relative(STATIC, f).split(sep).join('/')));
const resolves = (path: string) =>
  existing.has(path) || existing.has(path.replace(/\/?$/, '/') + 'index.html') || path === '/';

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const config = JSON.parse(readFileSync(join(OUT, 'config.json'), 'utf8')) as {
  routes: { src?: string; headers?: Record<string, string> }[];
};
const cspFor = (path: string) =>
  config.routes.find((r) => r.src === path && r.headers?.['content-security-policy'])?.headers?.['content-security-policy'];

const hreflangMap = new Map<string, Map<string, string>>();
const pageReport: Record<string, unknown>[] = [];
let pendingTotal = 0;
const FORBIDDEN_TEXT = [/supabase/i, /sb_publishable/i, /sgixvphwhaocvgfisodc/i, /AI Discovery Demo/i, /localStorage/];
const FORBIDDEN_LD = ['aggregateRating', 'Review', 'review', 'Offer', 'offers', 'award', 'numberOfEmployees', 'logo'];

for (const file of htmlFiles) {
  const url = urlOf(file);
  const html = readFileSync(file, 'utf8');
  const is404 = url === '/404.html';
  const head = html.slice(0, html.indexOf('</head>'));

  // Structure
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) fail(`${url}: duplicate id(s): ${[...new Set(dup)].join(', ')}`);
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) fail(`${url}: expected exactly one <h1>, found ${h1s}`);
  if (!/<title>[^<]{5,}<\/title>/.test(head)) fail(`${url}: missing <title>`);
  const description = head.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description || description.length < 30) fail(`${url}: missing or short meta description`);
  if (!/<html lang="[a-z-]+" dir="(ltr|rtl)">/i.test(html)) fail(`${url}: html lang/dir missing`);
  if (!html.includes('class="skip-link" href="#main"') || !html.includes('id="main"')) fail(`${url}: skip link/main missing`);

  // Robots
  const robots = head.match(/<meta name="robots" content="([^"]*)"/)?.[1];
  if (!robots) fail(`${url}: missing robots meta`);
  if (launch && robots?.includes('noindex') && !is404) fail(`${url}: noindex in launch mode`);

  // Canonical + hreflang
  if (!is404) {
    const canonical = head.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (canonical !== ORIGIN + url) fail(`${url}: canonical ${canonical} is not self (${ORIGIN + url})`);
    const links = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
    const map = new Map(links.map((m) => [m[1]!, m[2]!]));
    if (!map.has('x-default')) fail(`${url}: missing x-default hreflang`);
    const lang = html.match(/<html lang="([^"]+)"/)?.[1] ?? '';
    if (map.get(lang) !== ORIGIN + url) fail(`${url}: hreflang does not include itself`);
    hreflangMap.set(ORIGIN + url, map);
  }

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const json = JSON.parse(m[1]!);
      const text = JSON.stringify(json);
      for (const k of FORBIDDEN_LD) if (text.includes(`"${k}"`) || text.includes(`"@type":"${k}"`)) fail(`${url}: forbidden structured data "${k}"`);
    } catch {
      fail(`${url}: invalid JSON-LD`);
    }
  }

  // Scripts, handlers, styles
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  for (const s of scripts) {
    const type = attr(`<script${s[1]}>`, 'type');
    if (type === 'application/ld+json') continue;
    if (!attr(`<script${s[1]}>`, 'src')) fail(`${url}: inline executable <script> found`);
  }
  if (/\son[a-z]+\s*=/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(`${url}: inline event handler attribute`);
  if (/javascript:/i.test(html)) fail(`${url}: javascript: URL`);
  if (/\sstyle="/i.test(html)) fail(`${url}: inline style attribute`);

  // External resources (only outbound <a> links to sources are allowed)
  for (const m of html.matchAll(/<(script|link|img|iframe|source|video|audio|object|embed)\b[^>]*\s(?:src|href)="(https?:)?\/\/[^"]+"/gi)) {
    const tag = m[0];
    if (/rel="(canonical|alternate)"/.test(tag)) continue;
    fail(`${url}: external resource ${tag.slice(0, 120)}`);
  }
  for (const m of html.matchAll(/<form\b[^>]*action="([^"]*)"/g)) {
    if (!m[1]!.startsWith('/')) fail(`${url}: form posts off-site (${m[1]})`);
  }

  // Legacy remnants
  for (const re of FORBIDDEN_TEXT) if (re.test(html)) fail(`${url}: legacy/forbidden text ${re}`);

  // Claim lint on the rendered page (visible text and attributes)
  for (const hit of findClaimViolations(html)) {
    fail(`${url}: claim lint "${hit.match}" — ${hit.why}`);
  }

  // Internal links
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = m[1]!;
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!html.includes(`id="${id}"`)) fail(`${url}: anchor ${href} has no target`);
      continue;
    }
    if (/^(https?:|mailto:)/.test(href)) continue;
    const path = href.split('#')[0]!.split('?')[0]!;
    if (path.startsWith('/') && path.split('/')[2] === 'submit') continue; // on-demand route
    if (!resolves(path)) fail(`${url}: broken internal link ${href}`);
  }

  // CSP header present for this route
  const routePath = is404 ? '/404' : url;
  const csp = cspFor(routePath);
  if (!csp) fail(`${url}: no CSP header route for ${routePath}`);
  else {
    for (const d of ["object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", "form-action 'self'"]) {
      if (!csp.includes(d)) fail(`${url}: CSP missing ${d}`);
    }
    const scriptSrc = csp.match(/script-src ([^;]*)/)?.[1] ?? '';
    if (/'unsafe-inline'|'unsafe-eval'/.test(scriptSrc)) fail(`${url}: CSP script-src allows unsafe-inline/eval`);
  }

  // Pending markers
  const pending = [...html.matchAll(/data-pending="([^"]*)"/g)].map((m) => m[1]!);
  pendingTotal += pending.length;
  if (launch && pending.length > 0) fail(`${url}: ${pending.length} unconfirmed item(s) in launch mode`);

  // Size budget: HTML + linked CSS + linked JS + fonts (images: none used)
  const assets = [...head.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]!);
  const jsAssets = [...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]!);
  const gz = (p: string) => gzipSync(readFileSync(join(STATIC, p))).length;
  const cssGzip = assets.reduce((n, a) => n + gz(a), 0);
  const jsGzip = jsAssets.reduce((n, a) => n + gz(a), 0);
  const htmlGzip = gzipSync(html).length;
  const transfer = htmlGzip + cssGzip + jsGzip;
  if (jsGzip > BUDGET.jsGzip) fail(`${url}: JS ${jsGzip} B gzip over budget`);
  if (cssGzip > BUDGET.cssGzip) fail(`${url}: CSS ${cssGzip} B gzip over budget`);
  if (transfer > BUDGET.initialTransfer) fail(`${url}: initial transfer ${transfer} B over budget`);

  pageReport.push({ url, htmlGzip, cssGzip, jsGzip, transfer, robots, pending: pending.length });
}

// hreflang reciprocity: every alternate must point back.
for (const [page, map] of hreflangMap) {
  for (const [lang, href] of map) {
    if (lang === 'x-default') continue;
    const back = hreflangMap.get(href);
    if (!back) fail(`${page}: hreflang ${lang} -> ${href} is not a generated page`);
    else if (![...back.values()].includes(page)) fail(`${page}: hreflang ${lang} -> ${href} is not reciprocal`);
  }
}

// Sitemap and robots
const sitemap = readFileSync(join(STATIC, 'sitemap.xml'), 'utf8');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
for (const loc of sitemapLocs) if (!hreflangMap.has(loc)) fail(`sitemap: ${loc} is not a generated page`);
for (const page of hreflangMap.keys()) if (!sitemapLocs.includes(page)) fail(`sitemap: missing ${page}`);
const robotsTxt = readFileSync(join(STATIC, 'robots.txt'), 'utf8');
if (!launch && !robotsTxt.includes('Disallow: /\n')) fail('robots.txt: preview build must disallow all');

// Whole-artifact scans
const fontBytes = files.filter((f) => /\.(woff2?|ttf|otf)$/.test(f)).reduce((n, f) => n + statSync(f).size, 0);
if (fontBytes > BUDGET.fonts) fail(`fonts ${fontBytes} B over budget`);
const allJs = files.filter((f) => f.endsWith('.js'));
for (const f of [...files.filter((f) => /\.(js|css|html|txt|xml|svg)$/.test(f)), ...walk(join(OUT, 'functions'))]) {
  if (statSync(f).size > 20 * 1024 * 1024) continue;
  const text = readFileSync(f, 'utf8');
  if (/sb_publishable_|sgixvphwhaocvgfisodc|SUPABASE_URL/.test(text)) fail(`${relative(OUT, f)}: legacy Supabase reference`);
  if (/\beval\(|new Function\(/.test(text) && f.startsWith(STATIC)) fail(`${relative(OUT, f)}: eval in client asset`);
}
if (existing.has('/legacy/') || [...existing].some((p) => p.startsWith('/legacy'))) fail('a /legacy path is present');

const summary = {
  generatedAt: new Date().toISOString(),
  launchMode: launch,
  pages: htmlFiles.length,
  clientJsFiles: allJs.length,
  fontBytes,
  pendingTotal,
  sitemapUrls: sitemapLocs.length,
  errors,
  warnings,
  perPage: pageReport,
};

if (jsonOut) writeFileSync(jsonOut, JSON.stringify(summary, null, 2));
console.table(pageReport);
console.log(`pages=${htmlFiles.length} clientJsFiles=${allJs.length} fonts=${fontBytes}B pending=${pendingTotal} sitemap=${sitemapLocs.length}`);
if (warnings.length) console.log('WARNINGS:\n- ' + warnings.join('\n- '));
if (errors.length) {
  console.error('FAILED:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(launch ? 'verify-dist: PASS (launch mode)' : 'verify-dist: PASS (preview mode; pending items allowed)');
