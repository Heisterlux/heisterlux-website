# heisterlux-website

Public marketing website for Heisterlux. Astro + TypeScript, static pages, one on-demand route
for form submissions (Vercel adapter). No client-side JavaScript, no CMS, no product auth,
no Supabase, no third-party scripts.

The product is a separate Next.js application in `Heisterlux/heisterlux`.

## Commands

```bash
npm ci
npm run dev            # local dev server (CSP disabled in dev only; see astro.config.mjs)
npm run build          # deployable artifact in .vercel/output
npm run verify         # astro check + unit tests + contrast + build + dist verification
npm run serve:output   # serve the built artifact locally with its real headers (port 4330)
node scripts/verify-dist.ts --launch   # launch gate: fails while unconfirmed items or noindex remain
```

Node 24.x. On Windows machines where Smart App Control blocks Astro's native compiler binding,
install the official WASI fallback locally without saving it:
`npm install --no-save --force @astrojs/compiler-binding-wasm32-wasi@0.5.1`.

## Where things live

| Concern | Location |
| --- | --- |
| Locales (published / prepared) | `src/i18n/locales.ts` |
| UI dictionaries | `src/i18n/ui/*.ts` |
| Routes, stable content IDs, per-locale slugs | `src/content/routes.ts` |
| Page copy per locale | `src/content/copy/*.ts` |
| Product truth: capabilities + releases | `src/content/capabilities.ts`, `src/content/releases.ts` |
| Resources (sources, limitations, review dates) | `src/content/resources/` |
| Forms: schema, handler, providers, rate limit | `src/lib/forms/` |
| Unconfirmed facts | `src/config/site.ts` (null) and `<Pending>` markers |
| Design tokens | `src/styles/tokens.css` |

## Rules enforced in code

- A locale only produces URLs when `published: true`; there is no fallback to English under another locale.
- `available` capability status requires a customer release with production evidence, audience,
  support route and publication approval; internal merges/migrations/DEV tests never count.
- Builds are `noindex` unless `VERCEL_ENV=production` **and** `PUBLIC_SITE_INDEXABLE=true`.
- Forms are disabled unless `FORMS_MODE=sandbox` outside Vercel production. No live provider is wired.

Delivery report, open launch gates and the release/rollback plan: `docs/web-001e/`.
