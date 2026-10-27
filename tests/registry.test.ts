import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAPABILITIES, validateCapabilities, type CapabilityRecord } from '../src/content/capabilities.ts';
import { alternatesFor, livePages, pathFor, ROUTES } from '../src/content/routes.ts';
import { LOCALES, PUBLISHED_LOCALES } from '../src/i18n/locales.ts';
import { formatDate, ui } from '../src/i18n/index.ts';
import { copy } from '../src/content/copy/index.ts';

// ---------- Capability truth ----------
test('the shipped registry is valid and claims nothing as Available', () => {
  assert.deepEqual(validateCapabilities(CAPABILITIES), []);
  assert.equal(CAPABILITIES.filter((c) => c.status === 'available').length, 0);
});

test('R1: proportional-action and impact-view are In development, with the original classification kept in history', () => {
  const byId = (id: string) => CAPABILITIES.find((c) => c.id === id)!;
  const pa = byId('proportional-action');
  assert.equal(pa.status, 'in-development');
  assert.deepEqual(pa.history.map((h) => h.status), ['exploring', 'in-development']);
  const iv = byId('impact-view');
  assert.equal(iv.status, 'in-development');
  assert.deepEqual(iv.history.map((h) => h.status), ['up-next', 'in-development']);
  assert.equal(byId('change-sources').status, 'exploring');
  for (const c of CAPABILITIES) {
    const t = c.text.en!;
    assert.ok(t.built.length > 0 && t.toBuild.length > 0, c.id);
  }
  // Internal foundation is not presented as customer use.
  assert.match(pa.text.en!.built, /internal only/);
  assert.match(pa.text.en!.scope, /not a decision, and not enforced/);
  assert.match(iv.text.en!.limitations.join(' '), /does not by itself show/);
});

const base: CapabilityRecord = {
  id: 'x',
  stage: 'visibility',
  status: 'available',
  reviewedOn: '2026-09-30',
  text: { en: { name: 'X', summary: 's', scope: 's', built: 'b', toBuild: 't', limitations: [] } },
  internalEvidence: ['merged to main', 'migration applied on DEV', 'DEV tests pass'],
  history: [{ on: '2026-09-30', status: 'available', note: '' }],
};

test('Available without release evidence is rejected, whatever internal evidence exists', () => {
  const errors = validateCapabilities([base]);
  assert.ok(errors.some((e) => e.includes('requires availability evidence')));
});

test('Available referencing a non-existent release, or missing audience/support/approval, is rejected', () => {
  const errors = validateCapabilities([
    { ...base, availability: { releaseRefs: ['rel-unknown'], audience: '', support: '', publicationApprovedBy: '' } },
  ]);
  for (const part of ['unknown release', 'audience', 'support route', 'publication approval']) {
    assert.ok(errors.some((e) => e.includes(part)), part);
  }
});

test('status must match history, and withdrawals must be recorded', () => {
  const mismatch = validateCapabilities([{ ...base, status: 'exploring', history: [{ on: '2026-09-30', status: 'up-next', note: '' }] }]);
  assert.ok(mismatch.some((e) => e.includes('history')));
  const silentWithdrawal = validateCapabilities([
    { ...base, status: 'exploring', history: [{ on: '2026-09-30', status: 'exploring', note: '' }], withdrawn: { on: '2026-10-01', reason: 'r' } },
  ]);
  assert.ok(silentWithdrawal.some((e) => e.includes('withdrawal')));
});

// ---------- Locale/route registry ----------
test('only published locales generate pages; no silent fallback', () => {
  const locales = new Set(livePages().map((p) => p.locale));
  assert.deepEqual([...locales], PUBLISHED_LOCALES.map((l) => l.code));
  assert.ok(LOCALES.some((l) => !l.published), 'unpublished locales are declared but not routed');
  assert.throws(() => pathFor('home', 'nl'), /not published/);
  assert.throws(() => ui('nl'), /no silent fallback/);
  assert.throws(() => copy('de'), /no silent fallback/);
});

test('every page path is locale-prefixed and unique', () => {
  const paths = livePages().map((p) => p.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const p of paths) assert.match(p, /^\/(en|nl|de)\/([a-z0-9-]+\/)*$/);
});

test('alternates only include published translations of the same page', () => {
  for (const r of ROUTES.filter((r) => r.enabled)) {
    for (const a of alternatesFor(r.id)) {
      assert.ok(PUBLISHED_LOCALES.some((l) => l.code === a.locale));
      assert.ok(r.locales[a.locale]);
    }
  }
});

test('prepared models (changelog, release notes, docs) produce no routes without content', () => {
  for (const id of ['changelog', 'release-notes', 'documentation']) {
    assert.throws(() => pathFor(id, 'en'));
    assert.equal(livePages().some((p) => p.route.id === id), false);
  }
});

test('dates use Intl formatting in UTC', () => {
  assert.equal(formatDate('en', '2026-09-30'), 'September 30, 2026');
});
