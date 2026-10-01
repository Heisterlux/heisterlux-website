import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleSubmission, type HandlerDeps } from '../src/lib/forms/handler.ts';
import { resolveFormsMode, SandboxProvider } from '../src/lib/forms/providers.ts';
import { MemoryRateLimiter, rateLimitKey } from '../src/lib/forms/ratelimit.ts';
import { isValidEmail, validateBody } from '../src/lib/forms/schema.ts';

const ORIGIN = 'http://localhost:4321';

function post(form: string, body: string | URLSearchParams, headers: Record<string, string> = {}): Request {
  return new Request(`${ORIGIN}/en/submit/${form}/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', origin: ORIGIN, 'sec-fetch-site': 'same-origin', ...headers },
    body: typeof body === 'string' ? body : body.toString(),
  });
}

function deps(provider: SandboxProvider | null, overrides: Partial<HandlerDeps> = {}): HandlerDeps {
  return {
    mode: provider ? 'sandbox' : 'disabled',
    provider,
    rateLimiter: new MemoryRateLimiter(100, 60_000),
    rateLimitSalt: 'test-salt',
    clientAddress: '203.0.113.7',
    ...overrides,
  };
}

const keepInformed = (email: string) => new URLSearchParams({ email, consent: 'yes', website: '' });

// ---------- Mode resolution ----------
test('forms are disabled by default and for unknown values', () => {
  assert.equal(resolveFormsMode({}), 'disabled');
  assert.equal(resolveFormsMode({ FORMS_MODE: 'brevo' }), 'disabled');
  assert.equal(resolveFormsMode({ FORMS_MODE: 'SANDBOX' }), 'disabled');
});

test('sandbox mode is refused on Vercel production', () => {
  assert.equal(resolveFormsMode({ FORMS_MODE: 'sandbox', VERCEL_ENV: 'production' }), 'disabled');
  assert.equal(resolveFormsMode({ FORMS_MODE: 'sandbox', VERCEL_ENV: 'preview' }), 'sandbox');
});

test('disabled mode refuses without reading the body and without fake success', async () => {
  const req = post('keep-informed', keepInformed('a@example.com'));
  const out = await handleSubmission(req, 'keep-informed', 'en', deps(null));
  assert.equal(out.kind, 'disabled');
  assert.equal(out.status, 503);
  assert.equal(req.bodyUsed, false);
});

// ---------- Double opt-in ----------
test('keep-informed starts double opt-in and only confirms with the issued token', async () => {
  const p = new SandboxProvider({ newToken: () => 'tok-1' });
  const out = await handleSubmission(post('keep-informed', keepInformed('Person@Example.com')), 'keep-informed', 'en', deps(p));
  assert.deepEqual(out, { kind: 'accepted', status: 200, confirmationRequired: true });
  assert.equal(p.subscribers.get('person@example.com')?.state, 'pending');
  assert.deepEqual(p.outbox, [{ type: 'doi-confirmation', to: 'person@example.com', token: 'tok-1' }]);
  assert.equal(await p.confirm('wrong'), false);
  assert.equal(p.subscribers.get('person@example.com')?.state, 'pending');
  assert.equal(await p.confirm('tok-1'), true);
  assert.equal(p.subscribers.get('person@example.com')?.state, 'confirmed');
});

test('keep-informed requires explicit consent', async () => {
  const p = new SandboxProvider();
  const out = await handleSubmission(post('keep-informed', 'email=a%40example.com&website='), 'keep-informed', 'en', deps(p));
  assert.equal(out.kind, 'invalid');
  assert.equal(out.kind === 'invalid' && out.errors['consent'], 'required');
  assert.equal(p.outbox.length, 0);
});

test('duplicate subscription gives the same response and sends no second email', async () => {
  const p = new SandboxProvider();
  const d = deps(p);
  const a = await handleSubmission(post('keep-informed', keepInformed('dup@example.com')), 'keep-informed', 'en', d);
  const b = await handleSubmission(post('keep-informed', keepInformed('DUP@example.com')), 'keep-informed', 'en', d);
  assert.deepEqual(a, b);
  assert.equal(p.outbox.filter((o) => o.type === 'doi-confirmation').length, 1);
});

test('unsubscribe suppresses: later sign-ups get the same response but no email, and old tokens die', async () => {
  const p = new SandboxProvider({ newToken: () => 'tok-s' });
  const d = deps(p);
  await handleSubmission(post('keep-informed', keepInformed('s@example.com')), 'keep-informed', 'en', d);
  await p.unsubscribe('s@example.com');
  assert.equal(await p.confirm('tok-s'), false);
  const again = await handleSubmission(post('keep-informed', keepInformed('s@example.com')), 'keep-informed', 'en', d);
  assert.deepEqual(again, { kind: 'accepted', status: 200, confirmationRequired: true });
  assert.equal(p.outbox.length, 1);
  assert.ok(p.suppressed.has('s@example.com'));
  assert.equal(p.subscribers.has('s@example.com'), false);
});

// ---------- Early access / contact ----------
test('early access does not subscribe to news without separate consent', async () => {
  const p = new SandboxProvider();
  const body = new URLSearchParams({ email: 'ea@example.com', organization: 'Org', role: 'CISO', useCase: 'Drafting', website: '' });
  const out = await handleSubmission(post('early-access', body), 'early-access', 'en', deps(p));
  assert.deepEqual(out, { kind: 'accepted', status: 200, confirmationRequired: false });
  assert.ok(p.earlyAccess.has('ea@example.com'));
  assert.equal(p.subscribers.size, 0);
});

test('early access with updates consent starts a separate double opt-in', async () => {
  const p = new SandboxProvider();
  const body = new URLSearchParams({ email: 'ea2@example.com', updatesConsent: 'yes' });
  const out = await handleSubmission(post('early-access', body), 'early-access', 'en', deps(p));
  assert.equal(out.kind === 'accepted' && out.confirmationRequired, true);
  assert.equal(p.subscribers.get('ea2@example.com')?.state, 'pending');
});

test('contact requires a message of reasonable length', async () => {
  const p = new SandboxProvider();
  const out = await handleSubmission(post('contact', 'email=c%40example.com&message=hi'), 'contact', 'en', deps(p));
  assert.equal(out.kind === 'invalid' && out.errors['message'], 'too-short');
  const ok = await handleSubmission(post('contact', 'email=c%40example.com&message=Hello+there%2C+a+question.'), 'contact', 'en', deps(p));
  assert.equal(ok.kind, 'accepted');
  assert.equal(p.contacts.length, 1);
});

// ---------- Malformed input / transport ----------
test('rejects unknown fields, duplicates, control characters and bad encodings', async () => {
  const p = new SandboxProvider();
  const d = deps(p);
  for (const body of ['email=a%40example.com&consent=yes&admin=1', 'email=a%40example.com&email=b%40example.com&consent=yes', 'email=a%40example.com%00&consent=yes']) {
    const out = await handleSubmission(post('keep-informed', body), 'keep-informed', 'en', d);
    assert.equal(out.kind, 'bad-request', body);
    assert.equal(out.status, 400);
  }
  const invalidUtf8 = new Request(`${ORIGIN}/en/submit/contact/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', origin: ORIGIN },
    body: new Uint8Array([0x65, 0x3d, 0xff, 0xfe]),
  });
  assert.equal((await handleSubmission(invalidUtf8, 'contact', 'en', d)).status, 400);
  assert.equal(p.outbox.length, 0);
});

test('field validation: email format, lengths, checkbox values, single-line fields', () => {
  assert.equal(isValidEmail('name@example.com'), true);
  for (const bad of ['plain', 'a@b', 'a b@example.com', '<a>@example.com', 'a@-example.com', `${'x'.repeat(65)}@example.com`]) {
    assert.equal(isValidEmail(bad), false, bad);
  }
  const long = validateBody('early-access', new URLSearchParams({ email: 'a@example.com', organization: 'x'.repeat(121) }).toString());
  assert.equal(!long.ok && long.reason === 'fields' && long.errors['organization'], 'too-long');
  const cb = validateBody('keep-informed', 'email=a%40example.com&consent=on');
  assert.equal(!cb.ok && cb.reason === 'fields' && cb.errors['consent'], 'invalid-value');
  const nl = validateBody('early-access', 'email=a%40example.com&role=a%0Ab');
  assert.equal(!nl.ok && nl.reason === 'fields' && nl.errors['role'], 'invalid-value');
});

test('rejects wrong method, content type, oversized body and cross-origin posts', async () => {
  const d = deps(new SandboxProvider());
  const get = new Request(`${ORIGIN}/en/submit/contact/`, { method: 'GET' });
  assert.equal((await handleSubmission(get, 'contact', 'en', d)).status, 405);
  const json = post('contact', '{}', { 'content-type': 'application/json' });
  assert.equal((await handleSubmission(json, 'contact', 'en', d)).status, 415);
  const big = post('contact', `email=a%40example.com&message=${'x'.repeat(9000)}`);
  assert.equal((await handleSubmission(big, 'contact', 'en', d)).status, 413);
  const lying = post('contact', `email=a%40example.com&message=${'x'.repeat(9000)}`, { 'content-length': '10' });
  assert.equal((await handleSubmission(lying, 'contact', 'en', d)).status, 413);
  const cross = post('contact', 'email=a%40example.com&message=hello+world', { origin: 'https://evil.example' });
  assert.equal((await handleSubmission(cross, 'contact', 'en', d)).status, 403);
  const noOrigin = new Request(`${ORIGIN}/en/submit/contact/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'email=a%40example.com&message=hello+world',
  });
  assert.equal((await handleSubmission(noOrigin, 'contact', 'en', d)).status, 403);
  const crossSite = post('contact', 'email=a%40example.com&message=hello+world', { 'sec-fetch-site': 'cross-site' });
  assert.equal((await handleSubmission(crossSite, 'contact', 'en', d)).status, 403);
});

test('honeypot looks like success but does nothing', async () => {
  const p = new SandboxProvider();
  const body = new URLSearchParams({ email: 'bot@example.com', consent: 'yes', website: 'https://spam.example' });
  const out = await handleSubmission(post('keep-informed', body), 'keep-informed', 'en', deps(p));
  assert.equal(out.kind, 'accepted');
  assert.equal(p.outbox.length, 0);
  assert.equal(p.subscribers.size, 0);
});

// ---------- Rate limit ----------
test('rate limit blocks after the limit with Retry-After and resets after the window', async () => {
  let now = 0;
  const limiter = new MemoryRateLimiter(2, 60_000, () => now);
  const p = new SandboxProvider();
  const d = deps(p, { rateLimiter: limiter });
  const send = () => handleSubmission(post('keep-informed', keepInformed('r@example.com')), 'keep-informed', 'en', d);
  assert.equal((await send()).kind, 'accepted');
  assert.equal((await send()).kind, 'accepted');
  const blocked = await send();
  assert.equal(blocked.kind, 'rate-limited');
  assert.equal(blocked.kind === 'rate-limited' && blocked.retryAfterSeconds, 60);
  now = 60_000;
  assert.equal((await send()).kind, 'accepted');
});

test('rate-limit keys are salted hashes, not IP addresses', async () => {
  const k = await rateLimitKey('salt', '203.0.113.7', 'contact');
  assert.match(k, /^[0-9a-f]{64}$/);
  assert.ok(!k.includes('203'));
  assert.notEqual(k, await rateLimitKey('other-salt', '203.0.113.7', 'contact'));
});

// ---------- Provider failure ----------
test('provider failure returns a generic error and nothing is recorded as sent', async () => {
  const p = new SandboxProvider();
  p.failing = true;
  const out = await handleSubmission(post('keep-informed', keepInformed('f@example.com')), 'keep-informed', 'en', deps(p));
  assert.deepEqual(out, { kind: 'provider-error', status: 502 });
  assert.equal(p.outbox.length, 0);
});

// ---------- Logging ----------
test('logs never contain submitted personal data', async () => {
  const lines: string[] = [];
  const orig = console.info;
  console.info = (msg: string) => lines.push(msg);
  try {
    const p = new SandboxProvider();
    const body = new URLSearchParams({ email: 'secret.person@example.com', message: 'my private message text', website: '' });
    await handleSubmission(post('contact', body), 'contact', 'en', deps(p));
    p.failing = true;
    await handleSubmission(post('contact', body), 'contact', 'en', deps(p));
  } finally {
    console.info = orig;
  }
  assert.ok(lines.length >= 2);
  for (const l of lines) {
    assert.ok(!/secret|example\.com|private|203\.0\.113/.test(l), l);
  }
});
