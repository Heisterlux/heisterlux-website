import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { isSeoEligible, livePages, ROUTES, SEO_ALLOWLIST, type RouteDef } from '../src/content/routes.ts';

const EXPECTED = [
  'home',
  'product',
  'how-it-works',
  'roadmap',
  'resource:four-layers',
  'resource:when-ai-changes',
];

test('the SEO allowlist is exactly the six approved marketing pages', () => {
  assert.deepEqual([...SEO_ALLOWLIST].sort(), [...EXPECTED].sort());
});

test('only the allowlisted routes are eligible; every other route is not', () => {
  const eligible = ROUTES.filter(isSeoEligible).map((r) => r.id);
  assert.deepEqual(eligible.sort(), [...EXPECTED].sort());
  for (const id of ['trust', 'legal', 'privacy', 'pricing', 'early-access', 'about', 'contact', 'resources', 'resource:ai-literacy-eu']) {
    const route = ROUTES.find((r) => r.id === id);
    assert.ok(route, `${id} exists`);
    assert.equal(isSeoEligible(route), false, `${id} must stay noindex`);
  }
});

test('an allowlisted route is not eligible unless its copy is approved and it is enabled', () => {
  const home = ROUTES.find((r) => r.id === 'home')!;
  assert.equal(isSeoEligible(home), true);
  assert.equal(isSeoEligible({ ...home, copyStatus: 'new-draft' } as RouteDef), false);
  assert.equal(isSeoEligible({ ...home, copyStatus: 'reviewed' } as RouteDef), false);
  assert.equal(isSeoEligible({ ...home, enabled: false } as RouteDef), false);
});

test('approved copy alone is not enough: a route outside the allowlist stays ineligible', () => {
  const trust = ROUTES.find((r) => r.id === 'trust')!;
  assert.equal(isSeoEligible({ ...trust, copyStatus: 'approved' } as RouteDef), false);
});

test('every eligible route is a generated page', () => {
  const live = new Set(livePages().map((p) => p.route.id));
  for (const id of EXPECTED) assert.ok(live.has(id), `${id} is generated`);
});

/** INDEXABLE is read from the environment at import time, so each scenario runs in its own process. */
function indexableIds(env: Record<string, string>): string[] {
  const url = pathToFileURL(join(process.cwd(), 'src/content/routes.ts')).href;
  const script = `const m = await import(${JSON.stringify(url)}); console.log(JSON.stringify(m.ROUTES.filter(m.isIndexable).map((r) => r.id)));`;
  const clean: Record<string, string | undefined> = { ...process.env, VERCEL_ENV: undefined, PUBLIC_SITE_INDEXABLE: undefined, ...env };
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: clean as NodeJS.ProcessEnv, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  return JSON.parse(run.stdout.trim()) as string[];
}

test('production with the release switch indexes exactly the allowlist', () => {
  assert.deepEqual(indexableIds({ VERCEL_ENV: 'production', PUBLIC_SITE_INDEXABLE: 'true' }).sort(), [...EXPECTED].sort());
});

test('production without the release switch indexes nothing', () => {
  assert.deepEqual(indexableIds({ VERCEL_ENV: 'production' }), []);
  assert.deepEqual(indexableIds({ VERCEL_ENV: 'production', PUBLIC_SITE_INDEXABLE: 'false' }), []);
});

test('preview and development never index, even with the release switch', () => {
  assert.deepEqual(indexableIds({ VERCEL_ENV: 'preview', PUBLIC_SITE_INDEXABLE: 'true' }), []);
  assert.deepEqual(indexableIds({ VERCEL_ENV: 'development', PUBLIC_SITE_INDEXABLE: 'true' }), []);
  assert.deepEqual(indexableIds({ PUBLIC_SITE_INDEXABLE: 'true' }), []);
});
