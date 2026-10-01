import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLAIM_RULES, findClaimViolations } from '../scripts/claim-lint.ts';
import { CAPABILITIES } from '../src/content/capabilities.ts';
import { en as copyEn } from '../src/content/copy/en.ts';
import { RESOURCES } from '../src/content/resources/index.ts';
import { buildResourceRoutes, isLive, ROUTES } from '../src/content/routes.ts';
import { en as uiEn } from '../src/i18n/ui/en.ts';

const allText = JSON.stringify({ copyEn, uiEn, resources: RESOURCES, caps: CAPABILITIES.map((c) => c.text) });

test('copy contains none of the known overclaims', () => {
  assert.deepEqual(findClaimViolations(allText), []);
});

test('claim lint actually catches the original phrasings (rules are not vacuous)', () => {
  const samples = [
    'Heisterlux records them separately, because each can change on its own.',
    'We are working with a small number of organizations before launch.',
    'We are working out pricing together with organizations in early access.',
    'Nothing you entered was sent or stored.',
    'Your submission could not be completed. Nothing was sent.',
    'We only use this to reply to you.',
    'Heisterlux does not scan devices, networks or employee activity.',
    'the change points straight to this reliance',
    'accessed through',
  ];
  for (const sample of samples) assert.ok(findClaimViolations(sample).length > 0, sample);
  assert.ok(CLAIM_RULES.length >= samples.length - 1);
});

test('the early-customer feedback boundary is stated on early access and roadmap', () => {
  const sentence = 'Early customers help inform priorities, but do not buy control over the roadmap or a promise of custom development.';
  assert.ok(copyEn.earlyAccess.whatItems.includes(sentence));
  assert.ok(copyEn.roadmap.disclaimer.includes(sentence));
});

test('four-distinctions diagram: three separate descriptors on a concrete use, no chain connectors', () => {
  const d = copyEn.home.diagram;
  assert.equal(d.parts.length, 3);
  assert.deepEqual(d.parts.map((p) => p.id).sort(), ['application', 'context', 'system']);
  assert.match(d.label, /not a chain/i);
  assert.ok(d.caption.length > 0);
  assert.equal(copyEn.home.layers.length, 4, 'full text equivalent lists all four distinctions');
  assert.ok(copyEn.home.relations.length >= 4, 'relations spell out that links are not one-to-one');
  assert.ok(copyEn.home.relations.some((r) => /not tied one-to-one/i.test(r)));
  assert.ok(!('layerConnectors' in copyEn.home));
});

test('host applications are not described as Deployment Contexts', () => {
  assert.match(copyEn.home.layersNote, /is not a Deployment Context/);
});

test('forms: hints are purpose-bound per form and Keep me informed does not claim "reply only"', () => {
  const h = copyEn.forms.hints;
  assert.match(h['keep-informed'].email, /confirmation email/);
  assert.match(h['keep-informed'].email, /Only if you confirm/);
  assert.match(h['early-access'].email, /early access request/);
  assert.match(h.contact.email, /reply to your message/);
  assert.notEqual(h['keep-informed'].email, h.contact.email);
});

test('form result messages make no unproven guarantees', () => {
  const r = copyEn.forms.results;
  assert.match(r.providerError, /could not confirm whether your submission was received/);
  assert.doesNotMatch(r.disabled, /stored|sent/);
  assert.doesNotMatch(r.providerError, /nothing/i);
});

test('Trust covers the seven topics, each with principle and launch requirement; two claim no evidence', () => {
  const ids = copyEn.trust.topics.map((t) => t.id);
  assert.deepEqual(ids, ['explainability', 'evidence-provenance', 'historical-justification', 'uncertainty', 'human-authority', 'data-ownership', 'recoverability']);
  for (const t of copyEn.trust.topics) {
    assert.ok(t.principle.length > 20 && t.before.length > 20, t.id);
  }
  const unproven = copyEn.trust.topics.filter((t) => t.today === null).map((t) => t.id);
  assert.deepEqual(unproven, ['data-ownership', 'recoverability']);
  const recov = copyEn.trust.topics.find((t) => t.id === 'recoverability')!;
  assert.match(recov.principle, /hard product gate/);
  assert.match(recov.before, /None of these is claimed today/);
  for (const t of copyEn.trust.topics) assert.doesNotMatch(t.today ?? '', /\b(RPO|RTO|encrypted|certified|SOC|ISO)\b/i, t.id);
});

test('AI literacy article is based on the official regulation and keeps the three states apart', () => {
  const article = RESOURCES.find((a) => a.id === 'ai-literacy-eu')!;
  const c = article.locales.en!;
  const urls = c.sources.map((s) => s.url);
  assert.ok(urls.includes('https://eur-lex.europa.eu/eli/reg/2026/1744/oj'));
  assert.ok(urls.includes('https://eur-lex.europa.eu/eli/reg/2024/1689/oj'));
  const text = JSON.stringify(c);
  for (const part of ['2026/1744', '24 July 2026', '27 July 2026', '2 February 2025', 'Proposal', 'Adopted amendment', 'Applicable obligation', 'not legal advice']) {
    assert.ok(text.includes(part), part);
  }
  assert.ok(ROUTES.some((r) => r.articleId === 'ai-literacy-eu' && r.enabled), 'verified article stays routed (it would be removed from routes if it were not verifiable)');
});

test('a resource article set to draft disappears from routes, listing and sitemap inputs; the others are unaffected', () => {
  const [first, second] = RESOURCES;
  const routes = buildResourceRoutes([{ ...first!, published: false }, second!]);
  assert.equal(isLive(routes[0]!, 'en'), false);
  assert.equal(isLive(routes[1]!, 'en'), true);
});
