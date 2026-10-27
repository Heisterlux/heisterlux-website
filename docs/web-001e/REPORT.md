# WEB-001E — Delivery report (updated for WEB-001E-R1)

Branch `web-001e/astro-site` · draft PR #1 · Verdict: **READY WITH OPEN LAUNCH GATES**

|  |  |
| --- | --- |
| Reviewed head (before R1) | `0e83c6d8a9fd1fb8fe21eb4d693c7bca4aa940d0` |
| Code-bearing head for R1 | `63370aa60a4aec7bfaedd73f6513631c3d8d1b83` (the docs-only commit that records this SHA comes right after it; code is identical) |
| Protected preview of that head | `https://heisterlux-website-81c0l7je7-heisterlux-s-projects.vercel.app (immutable preview of that commit; branch alias https://heisterlux-website-git-web-001e-as-ca1bde-heisterlux-s-projects.vercel.app follows the latest push)` (Vercel SSO-protected; protection unchanged) |
| Merged / public / DNS / Vercel settings / live provider | **no** — none of these was touched |

Everything below separates what was **executed and observed** from what is **not done**.

## 1. Review findings → change → verification

| # | Finding | Change | Verification |
| --- | --- | --- | --- |
| R1 | `proportional-action` was Exploring, under-evidenced | → **In development**; `impact-view` Up next → **In development** (see §2). Original classifications kept in the append-only history. Each capability now shows *built so far (internal)*, *still to build* and *customer use today*. Registry validator requires both texts. | 38 unit tests incl. status/history assertions; verifier; Roadmap and Product screenshots |
| R2 | Diagram chained AI system → Deployment Context → Application → Reliance | New concrete-use model: reliance rests on a concrete use; the use is described by three **separate** descriptors (AI system or capability, Deployment Context, application or service). New caption, `aria-label`, `aria-describedby` → full text list, "How they relate" list, host-application note. Plain SVG, no library. | Screenshot crops 375 px / 1280 px; unit tests on copy structure; axe |
| R3 | Present-tense and traction claims | Pre-launch wording ("is being built to keep these distinctions explicit"), "may be affected", dependency path ≠ proof, human judgement stated; no "small number of organizations", no joint pricing work; "does not scan" only as *current scope*, automatic discovery "not promised"; feedback boundary added to Early access and Roadmap. Claim lint added. | `tests/copy.test.ts` (14 rules, proven non-vacuous), same lint on every rendered page in `verify-dist` |
| R4 | Trust page only covered the website | Seven topics, each split into *principle / evidenced today / before launch*. Two (customer data ownership, recoverability) claim nothing as proven. Recoverability before the first paying customer is stated as a hard product gate. | Tests: seven ids, two unproven, no RPO/RTO/certification wording in "today"; screenshots |
| R5 | AI-literacy article relied on the Commission Q&A | Verified against the official EUR-Lex text of Regulation (EU) 2026/1744 and the original AI Act; article rewritten, three states kept apart, Q&A treated as non-authoritative; a `published` flag can pull an article from route, nav, listing and sitemap alone. | `evidence/r5-legal-verification.md`; tests; sitemap check |
| R6 | Sandbox ≠ Brevo; preview must not take personal data; hint and error wording | Simulator runs **only off Vercel** (`VERCEL`, `VERCEL_ENV` or `VERCEL_URL` ⇒ disabled, tested for production, preview, development). Rate limiter renamed `InMemoryTestRateLimiter`, documented as a test helper. Purpose-bound hints per form. Disabled and provider-failure messages no longer promise "nothing sent or stored". Error summary takes focus without JS. Result page names the simulator. | Unit tests; local HTTP + keyboard run; **preview run on Vercel** (below) |
| R7 | Review evidence | Screenshots, axe, keyboard walkthrough, preview flow, build/type/content/link checks, regression tests — see §3 | §3 |

## 2. Capability statuses and evidence

Classification rule used: `available` needs customer release evidence (none exists); `in-development` = an implemented
internal foundation or active build exists, with customer integration missing; `up-next` needs an approved direction and
no foundation; `exploring` = no approved direction and no implementation. A missing customer UI alone is not "exploring".

| Capability | Before → after | Evidence (repository-backed; internal documents are cited by ID, no environment identifiers) | Still to build |
| --- | --- | --- | --- |
| Proportionate next steps | Exploring → **In development** | REL-010-3 closure (24-09-2026): proportional recommendation foundation (deterministic, LLM-free; reconfirm / reassess / escalate policy; recommendation ≠ disposition ≠ enforcement) tested, promoted to `main` via PR #76 and activated in persistent DEV; DEV-010-3 foundation document. Production not touched; no customer integration. | Customer-facing explanation and surface (DEV-010-4 proposed, not authorized), declaration with verified authority (DEV-010-5, depends on an authority decision), decision recording (DEV-010-6), production release, support, approval |
| Impact view | Up next → **In development** | DEV-010-2 (merged and activated): support-change findings, **direct** affected determinations, remaining-support view; indirect/inferred classes deliberately not computed. Internal only. | Indirect/inferred impact, customer surface, evidence limits and human review, production release |
| AI inventory, Deployment Contexts, Reliance and criticality, Review signals, Evidence trail | In development (unchanged) | Asset register, DEV-011 Deployment Context work, ODU / justification / criticality declarations, review-signal view, audit infrastructure exist on DEV only; production release for the Deployment Context chain is not approved; the audit-trail test round returned findings that are still open (stated on the site) | Customer-ready flows, production release, support, approval |
| External change sources | Exploring (unchanged) | ONT-010 carry-forward CF-5 (who supplies verified change information) is an open question; no approved direction, nothing built | Direction decision first |
| **Available** | none | no customer release exists | — |

The status history of both corrected capabilities contains the original entry and a dated correction entry.

## 3. Evidence — what was refreshed

All of this ran on the final code unless marked "carried over".

| Check | Result |
| --- | --- |
| `astro check` | 0 errors, 0 warnings, 0 hints |
| Unit tests | 38 / 38 (forms 18, registry 10, copy 10: claim lint, Trust, diagram, article, draft switch) |
| `npm run verify` | passes: check, tests, contrast (44 pairs, light + dark), build, dist verifier |
| Dist verifier (16 pages) | links/anchors, one h1, titles/descriptions, self-canonical, hreflang reciprocity + x-default, JSON-LD, **duplicate ids** (new), no inline script/handler/style, no external resources, no legacy strings, CSP per route, budgets, sitemap ↔ pages, **claim lint on rendered HTML** (new) |
| `npm audit` | 0 vulnerabilities (axe-core 4.13.0 added as pinned dev dependency) |
| axe-core 4.13 | 64 scans (16 pages × light/dark × 1280/320 px): **0 violations**; 8 "needs review" entries are `color-contrast` on SVG text (home, how it works), covered by the token contrast check. It found one real defect in this round (duplicate `id="sources"` in the AI-literacy article) — fixed, and guarded by a verifier check and a reserved-anchor rule. |
| Keyboard walkthrough (real key events via DevTools Protocol in headless Edge) | 32 / 32: skip link first and working, logical header order, visible 3 px focus outline on every in-page stop, no focus trap, mobile menu opens with Enter and Space, disabled forms skipped by Tab, error flow: focus lands on the error summary, summary links move focus to the field, aria-invalid + associated message, value kept, recovery succeeds |
| Lighthouse 12 (mobile, simulated throttling, local artifact; lab data) | home / trust / roadmap: Performance 0.99–1.00, Accessibility 1.00, Best practices 1.00, LCP 0.9–1.1 s, CLS 0, TBT 50–110 ms, 29–33 KB transferred. SEO 0.66 only because preview builds are `noindex` |
| Screenshots | `evidence/screenshots/`: desktop + true 375 px mobile for home, how it works, product, roadmap, trust, pricing, early access, contact, resources and both articles; dark home and trust; diagram crops |
| Disabled-form flow on the **Vercel preview** | `evidence/vercel-preview-disabled-form-flow.txt` (see §4) |
| Carried over unchanged | Security headers on real Vercel responses (re-observed in the flow above), first-round Lighthouse SEO result for an indexable build, redirect and CSP route inspection from the first delivery |

## 4. Forms — what is and is not tested

- **Not a test of Brevo or any real provider.** The double opt-in, duplicate, unsubscribe/suppression and provider-failure tests exercise a
  *self-built in-memory simulator* (`SandboxProvider`). They show our handler's control flow, nothing about a provider's behaviour. No real
  provider exists in the code and none was contacted.
- The simulator runs only off Vercel. The rate limiter used with it is a **test helper** (`InMemoryTestRateLimiter`), not a production facility.
  Durable rate limiting is still launch gate G-RATELIMIT. During the keyboard runs the helper correctly returned "too many attempts" after
  six submissions in ten minutes — the helper working as a test aid, not a finished control.
- On Vercel the forms are disabled (the default; `FORMS_MODE` is not set). Preview run with synthetic input only, through Vercel's temporary
  share link (no protection setting changed): every same-origin POST returned **503 "Submissions are not open yet"** (valid, invalid, unknown-field,
  honeypot, repeated), **no success text anywhere**, JSON and cross-origin POSTs refused (503 / 403), GET redirects to the form. Response headers:
  `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow`, CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy,
  COOP/CORP, no `Set-Cookie`. Vercel runtime logs show one code-only line per request (`outcome":"disabled"`); a full-text search for the synthetic
  marker and address found nothing. A provider call is impossible in this mode: the provider object is null and the handler returns before reading
  the body (unit-tested).
- Messages: "disabled" says the submission was not processed (no storage claim); provider failure says "We could not confirm whether your
  submission was received. Please try again a little later." — no claim that nothing was sent. The idempotent-retry requirement for a future real
  adapter is stated in the provider interface; it is **not** proven for any real provider.

## 5. Not done / limitations

- **No screen-reader test** (NVDA, JAWS, VoiceOver, Narrator): not executable here. Left open. No WCAG conformance claim; axe and the keyboard run
  find only part of the possible problems, and the keyboard run is headless Edge only.
- No field performance data; no durable rate limiter; form route verified on Vercel only in disabled mode; no real provider test.
- Only English exists; second locale and RTL are structurally prepared, never rendered.
- The AI-literacy article reflects the official text on 2026-10-01; later corrigenda or national measures are not covered; not legal advice.
- Windows Smart App Control blocks Astro's native compiler binding on the build machine; local checks used the official WASI binding installed
  with `--no-save`. Vercel's own build uses the native binding and succeeds.

## 6. Recovery (carried over from the first delivery, re-verified at the start of R1)

Website repo `Heisterlux/heisterlux-website`, `main` `e07a08ddf0c4c0fbddfb2826daf8a9e60ca2cfe0`, tree `0816df804726dec9cb3da36283fb0b0c69d40b7f`;
branch head at R1 start `0e83c6d8a9fd1fb8fe21eb4d693c7bca4aa940d0` (clean, equal to origin). Legacy: single `index.html` demo with client-side
Supabase calls (removed from the artifact; stays in Git history). Vercel project `heisterlux-website`
(`prj_BFrZb29W7HvBc2YYDUUQMzGdKTWP`), framework preset not set, SSO protection `all_except_custom_domains`, production alias still serves the legacy build;
branch pushes build protected previews only. Findings that affect release: `heisterlux-website.vercel.app` serves the legacy demo publicly today
(merge would replace it with the pre-launch site); `heisterlux.com`, `www` and `app` currently redirect to a third-party host
(`heisterlux-com.l.ink`), not Vercel. No approved WEB-001A/B/C copy was found; all copy is a new draft.

## 7. Open launch gates

| ID | Gate | Owner | State |
| --- | --- | --- | --- |
| G-COPY | Review and approve all copy, the Trust principles and the capability statuses | Martin / ChatGPT review | open |
| G-LEGAL | Entity details, privacy notice, legal page (7 visible markers) | Martin (+ legal adviser) | open — Martin still has to provide the company/domain data; nothing was invented |
| G-MAIL | Heisterlux mailbox; SPF/DKIM/DMARC; set contact and security addresses | Martin | open |
| G-FORMS | Provider decision (Brevo proposed: contract, region, consent export, retention, suppression), real-provider sandbox test, idempotent-retry proof | Martin decides; Claude implements | open |
| G-RATELIMIT | Durable, project-scoped rate limit (replace the in-memory test helper) | Martin approves config; Claude implements | open |
| G-SIGNIN | Verified public production login URL | Martin | open |
| G-DOMAIN | Domain/DNS plan, incl. who controls `heisterlux-com.l.ink` | Martin | open |
| G-INDEX | Decision to set `PUBLIC_SITE_INDEXABLE=true` | Martin | open |
| G-LEGACY | Legacy deployments, Git-history reference, RLS check of the Supabase project the old code called | Martin | open |
| G-A11Y | Screen-reader and broader manual audit before any conformance wording | Claude / external tester | open |
| G-TRUST | Recoverability (tested restore, RPO/RTO), export/deletion, security measures: evidence before the first paying customer; only then may the Trust page claim them | Martin / engineering | open, hard product gate |
| G-FIELD | Field performance (INP, TTFB) after launch | Claude | after launch |
| G-I18N | Reviewed translations before `nl`/`de` | Martin | later |
| G-PRICING / G-MOR | Pricing decision; Merchant-of-Record assessment | Martin / ChatGPT | later, nothing built |

Independent work continues without these: nothing in this round depended on the mailbox or company data.

## 8. Release and rollback plan (not applied; each step needs its own approval)

1. **Before merging:** ChatGPT review; Martin approves copy (G-COPY). Decide explicitly whether merging earlier than launch is acceptable: it replaces
   the legacy demo on `heisterlux-website.vercel.app` with the noindex pre-launch site.
2. **Vercel settings (when merging):** framework preset Astro (also in `vercel.json`), install `npm ci`, Node 24.x; keep SSO protection for previews;
   do **not** set `FORMS_MODE` or `PUBLIC_SITE_INDEXABLE`. Record the current settings first for rollback.
3. **Domains (launch):** export the DNS zone and the current redirect configuration; lower TTL a day ahead; add `heisterlux.com` (primary) and
   `www` (redirect to apex) to the project with the values Vercel shows at that moment; leave `app` and `dev` alone.
4. **Mail, privacy, legal:** mailbox and authentication, then set the addresses; fill every marker; `node scripts/verify-dist.ts --launch` must pass.
5. **Forms and sign-in:** stay disabled until G-FORMS and G-RATELIMIT close; sign-in link only with G-SIGNIN.
6. **Go-live:** set `PUBLIC_SITE_INDEXABLE=true` for production, redeploy, re-run headers, links, SEO checks on the real domain; submit the sitemap.
7. **Legacy closure:** tag the last legacy commit as recovery reference; decide on the 13 legacy deployments; check RLS of the referenced Supabase project.
8. **Rollback:** Vercel instant rollback to the previous good deployment of the new site, or a minimal holding page; restore the exported DNS records;
   settings from step 2. The legacy demo is **not** a rollback target (it carries login, admin and database code).
