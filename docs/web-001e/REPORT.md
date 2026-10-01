# WEB-001E — Delivery report

Date: 2026-10-01 · Branch: `web-001e/astro-site` · Verdict: **READY WITH OPEN LAUNCH GATES**

This is a pre-launch candidate. Nothing has been merged, published, pointed at a domain or
connected to a live provider. Everything below distinguishes what was **executed and observed**
from what is **not done**.

## 1. Recovery (verified 2026-09-30/10-01)

| Item | Found |
| --- | --- |
| Website repo / default branch | `Heisterlux/heisterlux-website`, `main` |
| Website `main` | `e07a08ddf0c4c0fbddfb2826daf8a9e60ca2cfe0` — matches reference |
| Website commit tree | `0816df804726dec9cb3da36283fb0b0c69d40b7f` — matches reference |
| Legacy content | `README.md` (20 bytes) + `index.html` (title "Heisterlux - AI Discovery Demo") |
| Legacy integrations | Supabase REST calls with a publishable key in client code, login, organization/register data |
| Other branches / PRs | none (only `main`; no PRs) |
| Product repo `main` | `fd6fac6886b2e83742abc04fbbd067b1a671161e` — matches reference; Next.js app routes only (login, signup, dashboard…) |
| `AGENTS.md` (website repo) | none present |
| Vercel project | `heisterlux-website`, `prj_BFrZb29W7HvBc2YYDUUQMzGdKTWP`, Git-connected, production branch `main`, framework preset **not set** (`null`), Node 24.x |
| Auto-deploy | Every push builds: `main` → production, other branches → preview |
| Protection | SSO protection `all_except_custom_domains`; no password protection |
| Domains on the project | `heisterlux-website.vercel.app` only |
| Aliases | `heisterlux-website.vercel.app`, `heisterlux-website-heisterlux-s-projects.vercel.app`, `…-git-main-…`, all → deployment of `e07a08d` |
| Deployments | 13 before this work, all legacy `main` builds; latest `e07a08d` is the production target and rollback candidate |
| Approved WEB-001A/B/C copy | **Not found.** `sources/` of the project mirror is empty, no matching documents on the machine. All copy is a **new draft**. |

Findings that affect the release (observed, not changed):

1. `https://heisterlux-website.vercel.app/` serves the **legacy demo publicly** (HTTP 200). The other
   Vercel URLs redirect to Vercel SSO. Merging this branch to `main` would replace that public page
   with the new site (noindex, forms disabled) — a separate, explicit decision.
2. `heisterlux.com`, `www.heisterlux.com` and `app.heisterlux.com` currently answer with
   `302 → heisterlux-com.l.ink` from an `openresty` server — i.e. **not Vercel**. Who controls that
   redirect, and the current DNS records, are not known from the available data.
3. `dev.heisterlux.com` is on Vercel behind SSO (302 to `vercel.com/sso-api`).
4. The legacy code, including its client-side Supabase URL and publishable key, remains in the public
   repository's Git history. A publishable key is designed to be public, but the RLS posture of the
   referenced Supabase project is outside this work (see gate G-LEGACY).

Branch push behaviour: the push created a **preview** deployment
(`dpl_FAoqsrfURFrJCeZsZdGXrnZ7bm3Q`, state READY, `target: null`) with an SSO-protected branch alias.
Production and all existing aliases still point at `e07a08d`. No Vercel setting was changed.

## 2. What was built

Astro 7.3.5 + TypeScript 6.0.3, `@astrojs/vercel` 11.0.11, one `package-lock.json`, Node 24.x.
Static output with a single on-demand route (`/{locale}/submit/{form}/`). **Zero client JavaScript**,
system fonts, no third-party requests, no product auth/Supabase/middleware credentials.
Legacy `index.html` and README removed from the artifact; no `/legacy` path exists (checked by the verifier).

Pages (English, 15 + 404): Home, Product, How it works, Roadmap, Trust, Pricing, Resources (+3 articles),
Early access, About, Contact, Privacy, Legal. Changelog, Release notes and Documentation are modelled but
produce no route until real content exists (unit-tested).

Key mechanisms (all enforced in code, see `README.md`): locale/route registry with no silent fallback;
capability + release registry with build-time rules for "Available"; disabled-by-default forms; hashed CSP;
noindex unless production **and** an explicit env flag.

## 3. Evidence — executed

| Check | Result | Where |
| --- | --- | --- |
| `astro check` (51 files) | 0 errors, 0 warnings, 0 hints | `npm run check` |
| Unit tests | 27 / 27 pass (forms, capability rules, locale registry, log privacy) | `tests/` |
| Production build | passes; 18 prerendered routes + 1 function | `npm run build` |
| `verify-dist` (preview mode) | PASS: 16 HTML pages, links/anchors, one `<h1>`, titles/descriptions, self-canonical, hreflang reciprocity + x-default, JSON-LD parses and has no rating/offer/review/logo types, no inline scripts/handlers/styles, no external resources, no legacy strings, CSP per route without unsafe-inline/eval, sitemap ↔ pages | `evidence/verify-dist-preview.json` |
| Client assets | 0 JS files; CSS 3.7 KB gzip (budget 50 KB); fonts 0 B; max page HTML+CSS ≈ 7.8 KB gzip (budget 500 KB) | verifier |
| Lighthouse 12, mobile, simulated throttling, **local built artifact** (not field data) | Performance 0.99–1.00, Accessibility 1.00, Best practices 1.00, LCP 0.9–1.2 s, CLS 0, TBT 10–120 ms, ≈27–31 KB transferred; SEO 0.66 on preview build only because of `noindex` (`is-crawlable`); SEO 1.00 on a simulated production-indexable build | home, early-access, article |
| axe-core 4.13 (WCAG 2.0/2.1/2.2 A+AA + best practice) | 0 violations on 16 pages (each page in at least one of light/dark); `color-contrast` marked "needs review" on Home and How it works (SVG text) | manual run in browser pane |
| Contrast (design tokens) | 44 pairs, light + dark, all ≥ requirement (text ≥ 4.5, UI ≥ 3) | `evidence/contrast.txt` |
| Reflow | no horizontal page scroll at 375 px (8 pages) and 320 px (4 pages); example table fixed after it overflowed at 320 px | scripted measurement |
| Keyboard (spot check) | skip link first, visible focus ring, mobile menu opens with Enter without JS | `evidence/screenshots/mobile-375-menu-open-keyboard.jpg` |
| Real headers on Vercel preview | CSP (hashes, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, `form-action 'self'`), HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP/CORP, `x-robots-tag: noindex`; no `Set-Cookie` | fetched via Vercel tool for `/en/` |
| Cookies/storage (local artifact) | `document.cookie` empty, `localStorage` empty, only 2 same-origin CSS requests | browser check |
| Production-build simulation | with `VERCEL_ENV=production` + `PUBLIC_SITE_INDEXABLE=true`: `index, follow`, `robots.txt` allows + sitemap, forms still disabled even if `FORMS_MODE=sandbox`; `verify-dist --launch` **fails** on 7 pending items (intended) | local |
| `npm audit` | 0 vulnerabilities after overriding `path-to-regexp@6` → 6.3.0 (it was bundled into the deployed function via the adapter) | `package.json` `overrides` |
| Screenshots | desktop (home, product flow pages, roadmap, trust, pricing, early access, article, privacy, 404), dark roadmap, mobile 375 | `evidence/screenshots/` |

### Sandbox form evidence

HTTP-level, local dev server with `FORMS_MODE=sandbox` (`evidence/http-form-tests.txt`) and unit-level
(`tests/forms.test.ts`, sandbox provider; **no real provider and no real email involved**):

- Disabled (default): POST → 503 "Submissions are not open yet", body not read, no success page.
- Keep me informed: needs explicit consent; starts double opt-in; identical response for a duplicate address;
  confirm only with the issued token; unsubscribe suppresses (no later email, old token dead).
- Early access does not subscribe to news; updates only with a separate consent + double opt-in.
- Malformed input: unknown/duplicate fields, control characters, invalid UTF-8, wrong content type,
  oversized body (also with a lying `Content-Length`), cross-origin and missing-Origin POSTs.
- Honeypot returns the normal success response and does nothing.
- Rate limit: 429 with `Retry-After`; keys are salted hashes, not IPs.
- Provider failure → generic 502 message, nothing recorded as sent.
- Logs contain only whitelisted codes; searched the dev-server log for addresses and message text: none.

## 4. Not done / limitations (stated plainly)

- **No manual screen-reader testing** and no complete keyboard walkthrough of every page. WCAG 2.2 AA is
  the target; **no conformance claim is made**.
- Lighthouse numbers are lab data from a local server; no field data (INP, real TTFB) exists. TTFB was not
  measured against Vercel.
- The form **submit route was not exercised on Vercel**; only locally. Rate limiting is **per-instance memory,
  not durable** (gate G-RATELIMIT).
- DOI, unsubscribe and suppression run against the in-memory sandbox, not against Brevo or any other real
  provider sandbox — none was available or approved.
- Only English exists. A second locale, RTL rendering and translated slugs are structurally supported and
  unit-tested for "unpublished produces nothing", but were never rendered.
- JSON-LD was validated structurally (parses, forbidden types absent), not with an external rich-result tool.
- Cookie banner: no cookies or storage were observed from this site, but hosting-layer behaviour in production
  and legal conclusions are for legal review; this report does not claim a banner is unnecessary.
- Windows Smart App Control blocked Astro's native compiler binding on the build machine; checks were run with
  the official WASI binding installed locally with `--no-save` (lockfile and `package.json` untouched). Vercel's
  own build used the native binding and succeeded.

## 5. Copy and claim status

- All copy is **new draft**; none is presented as approved. `copyStatus: 'new-draft'` per page.
- No logos, testimonials, metrics, customer counts, certifications, organization size, prices, discounts,
  referral terms or impact numbers. Pricing page states pricing is not set. The impact principle appears as an
  intention, explicitly "not a programme".
- Capability registry: 8 capabilities — 5 In development, 1 Up next, 2 Exploring, **0 Available**. The Roadmap
  says "No capability is Available yet." Internal evidence notes are stored but never rendered or counted.
- Deployment Context wording keeps hosts (word processors, meeting tools, mail clients, design tools) out of the
  definition, as specified.
- Resources: 3 articles with primary sources checked 2026-09-30 (EU AI Act via EUR-Lex and the Commission's
  AI-literacy Q&A, NIST AI RMF, OECD AI principles, vendor lifecycle pages), limitations and review dates.
  The EU AI-literacy article attributes the Article 4 amendment to the Commission's own Q&A and tells readers to
  check the current text; it needs a human/legal check before publication.
- The sloth butler appears only on the 404 page, as a small decorative line drawing.

### Missing information (shown as visible "To be confirmed" markers, 7 in total)

| Marker | Page(s) |
| --- | --- |
| Legal entity name, registered address, registration number | Privacy, Legal |
| Hosting provider, region, log retention | Privacy |
| Email provider, processing region, retention, legal bases | Privacy |
| Privacy-request contact + supervisory authority | Privacy |
| Company/VAT details | Legal |
| Heisterlux contact email | Contact |
| Security contact | Trust |

No email address has been invented; `CONTACT_EMAIL` and `SECURITY_EMAIL` are `null`. Sign in is **not shown**:
`SIGN_IN_URL` is `null` until a verified, public production login exists; Early access is the CTA.

## 6. Open launch gates

| ID | Gate | Owner | State |
| --- | --- | --- | --- |
| G-COPY | Review and approve all copy and the capability statuses | Martin / ChatGPT review | open |
| G-LEGAL | Entity details, privacy notice, legal page (7 markers) | Martin (+ legal adviser) | open |
| G-MAIL | Heisterlux mailbox; SPF/DKIM/DMARC for the sending domain; set contact/security addresses | Martin | open |
| G-FORMS | Provider decision (Brevo proposed: contract, region, consent export, retention, suppression), then adapter + provider-sandbox test | Martin decides; Claude implements | open |
| G-RATELIMIT | Durable, project-scoped rate limit (platform firewall rule or store) | Martin approves config; Claude implements | open |
| G-SIGNIN | Verified public production login URL (never DEV, no second auth system) | Martin | open |
| G-DOMAIN | Domain and DNS plan (see §7) incl. who controls `heisterlux-com.l.ink` | Martin | open |
| G-INDEX | Decision to set `PUBLIC_SITE_INDEXABLE=true` | Martin | open |
| G-LEGACY | Close legacy: old deployments, Git-history reference, Supabase project RLS check | Martin | open |
| G-A11Y | Manual keyboard + screen-reader audit before any conformance wording | Claude / external tester | open |
| G-FIELD | Collect field performance (INP, TTFB) after launch | Claude | after launch |
| G-I18N | Reviewed translations before `nl`/`de` are published | Martin | later |
| G-PRICING | Pricing decision before any price, discount or referral wording | Martin | later |
| G-MOR | Merchant-of-Record assessment (Paddle preferred; Stripe Managed Payments, Lemon Squeezy alternatives) | Martin / ChatGPT | later, nothing built |

## 7. Release and rollback plan (not applied)

Each step needs its own approval. Nothing below has been executed.

**A. Before merging**
1. ChatGPT review of this PR; Martin approves copy (G-COPY) and the open-gate list.
2. Decide whether merging to `main` earlier than launch is acceptable. Merge changes what
   `heisterlux-website.vercel.app` serves from the legacy demo to the new pre-launch site (noindex, forms
   disabled). That removes the public Supabase demo from that URL, which is probably desirable, but is public
   exposure of new content and needs an explicit yes.

**B. Vercel settings (when merging)**
3. Project settings: Framework preset Astro (also declared in `vercel.json`), install `npm ci`, Node 24.x.
   Keep SSO protection for previews. Do **not** set `FORMS_MODE`, `PUBLIC_SITE_INDEXABLE` yet.
4. Record current settings first (framework, build/install commands, env vars, protection) for rollback.

**C. Domains (launch)**
5. Export the current DNS zone and the `heisterlux-com.l.ink` configuration; lower TTL a day ahead.
6. Add `heisterlux.com` (primary) and `www.heisterlux.com` (redirect to apex) to the `heisterlux-website`
   project; apply the DNS values Vercel shows at that moment. Leave `app` and `dev` untouched; `app` must not be
   pointed at this project.

**D. Mail, privacy, legal**
7. Mailbox and mail authentication (G-MAIL), then set `CONTACT_EMAIL`/`SECURITY_EMAIL`.
8. Fill all pending markers (G-LEGAL). `node scripts/verify-dist.ts --launch` must pass: it fails while any
   marker remains or any page is noindex.
9. Forms stay disabled until G-FORMS and G-RATELIMIT are closed. Sign-in link only with G-SIGNIN.

**E. Go-live**
10. Set `PUBLIC_SITE_INDEXABLE=true` for production, redeploy, re-run header, link, SEO checks against the real
    domain; submit the sitemap.

**F. Legacy closure**
11. Tag the last legacy commit (`e07a08d`) as the recovery reference. Decide whether to delete the 13 legacy
    deployments or keep them SSO-protected; confirm RLS on the Supabase project referenced by the old code.
    A newer `main` build does **not** by itself remove old deployment URLs.

**G. Rollback**
- New site misbehaves: Vercel "Instant rollback" to the previous good deployment of the new site, or promote a
  minimal holding page. Config rollback uses the settings recorded in step 4.
- DNS: restore the exported records from step 5.
- The legacy demo is **not** a corporate rollback target (it carries login, admin and database code). It stays
  recoverable from Git history only.
