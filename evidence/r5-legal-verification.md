# R5 — Verification of the EU AI Act Article 4 amendment (2026-10-01)

Question: can the statements in the AI-literacy Resources article be traced to an official legal act,
and which state is each statement in (proposal / adopted amendment / applicable obligation)?

## Method

- Official text fetched from EUR-Lex. `curl` receives a bot challenge from EUR-Lex, so the pages were
  loaded in headless Microsoft Edge and the rendered HTML was read:
  - `https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng` (and the `TXT/HTML` rendering `OJ:L_202601744`)
  - `https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689` (original AI Act, for the old wording)
- The Commission Q&A page was read for comparison only.
- A web search surfaced law-firm and blog summaries that agree with the official data. They were **not**
  used as sources for any statement.

## Findings from the official text

| Item | Finding |
| --- | --- |
| Amending act | Regulation (EU) 2026/1744 of the European Parliament and of the Council ("Digital Omnibus on AI"), ELI `http://data.europa.eu/eli/reg/2026/1744/oj` |
| Signed | Strasbourg, 8 July 2026 (footnotes: Parliament position of 16 June 2026, Council decision of 29 June 2026) |
| Official Journal | OJ L, 2026/1744, **24.7.2026** |
| Entry into force | Final article: third day following publication. EUR-Lex shows the in-force date **2026-07-27** and status "in force". |
| Article 4 | "Article 4 is replaced by the following": new paragraph 1 (take measures to *support the development of* AI literacy; the obligation "does not require providers or deployers to guarantee any specific level of AI literacy of any individual"), paragraph 2 (Commission and Member States support, in particular SMEs; Commission publishes practical examples on the single information platform), paragraph 3 (AI Board recommendations). |
| Original Article 4 (Reg. 2024/1689) | Providers and deployers "shall take measures to ensure, to their best extent, a sufficient level of AI literacy" of staff and others. |
| Application dates | Article 113 as amended by 2026/1744: Chapters I and II (which contain Article 4) apply from 2 February 2025, except specific Article 5 points. The final provisions of 2026/1744 set no later application date for Article 4 (as read). |

## Commission Q&A page: why it is not relied on

Last updated 27 July 2026, but it keeps formulations from different times: "The European Commission *proposed* the
Digital Omnibus on AI…", "The amendments … *entered into force in mid-July 2026*" (the Official Journal says
publication 24 July, in force 27 July), and wording such as "to comply with Article 4 … should consider at least the
following steps" that belongs to the earlier text. It is explanatory material, not a legal act.

## Decision

The legal change is reliably verifiable from the official text, so the article **stays routed** (sitemap, navigation,
Resources list) and is rewritten to rely on EUR-Lex. It states the three states separately, treats the Q&A as
non-authoritative, and says what it does not conclude (how a given organization complies; national law; sector rules).

Withdrawal rule (kept for future reviews): if a statement cannot be traced to the Official Journal text, the article
is set back to draft and removed from routes, navigation and sitemap by disabling its route; the other Resources stay
published and nothing else on the site depends on it. Reviewed on 2026-10-01; to be re-checked at the next review date.

## Residual limits

Corrigenda, delegated/implementing acts, the AI Board's recommendations and national implementation are not covered.
Not legal advice.
