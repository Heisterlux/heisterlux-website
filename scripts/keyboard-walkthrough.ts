/**
 * Keyboard walkthrough with REAL key events, driven over the Chrome DevTools Protocol in headless
 * Edge/Chrome (no downloads, no extra dependencies; uses Node's global WebSocket).
 *
 * Usage: node scripts/keyboard-walkthrough.ts <artifactBase> <sandboxBase> [outfile]
 *   artifactBase: server of the built artifact with real headers (npm run serve:output), e.g. http://localhost:4330
 *   sandboxBase:  dev server started with FORMS_MODE=sandbox (local simulator), e.g. http://localhost:4322
 *
 * This is not a screen-reader test. It checks focus order, visible focus, skip link, menu operation,
 * disabled-form behaviour and the error flow with a keyboard only.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [artifact, sandbox, outFile] = process.argv.slice(2);
if (!artifact || !sandbox) {
  console.error('usage: node scripts/keyboard-walkthrough.ts <artifactBase> <sandboxBase> [outfile]');
  process.exit(2);
}

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];
const exe = BROWSERS.find((p) => existsSync(p));
if (!exe) throw new Error('No Edge/Chrome found');

const PORT = 9333;
const profile = mkdtempSync(join(tmpdir(), 'kbd-'));
const child = spawn(exe, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });

const lines: string[] = [];
const log = (s = '') => {
  lines.push(s);
  console.log(s);
};
const failures: string[] = [];
const check = (ok: boolean, msg: string) => {
  log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!ok) failures.push(msg);
};

async function connect(): Promise<WebSocket> {
  for (let i = 0; i < 60; i++) {
    try {
      const list = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
      const page = list.find((t) => t.type === 'page');
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise<void>((res, rej) => {
          ws.onopen = () => res();
          ws.onerror = () => rej(new Error('ws error'));
        });
        return ws;
      }
    } catch {
      // browser not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Could not connect to the browser');
}

const ws = await connect();
let nextId = 1;
const pending = new Map<number, (v: any) => void>();
const loadWaiters: (() => void)[] = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(String(ev.data));
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)!(msg);
    pending.delete(msg.id);
  } else if (msg.method === 'Page.loadEventFired') {
    loadWaiters.splice(0).forEach((f) => f());
  }
};
const send = (method: string, params: object = {}) =>
  new Promise<any>((res) => {
    const id = nextId++;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression: string) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const waitLoad = () => new Promise<void>((res) => { loadWaiters.push(res); setTimeout(res, 8000); });
const settle = (ms = 250) => new Promise((r) => setTimeout(r, ms));

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setFocusEmulationEnabled', { enabled: true });
await send('Page.bringToFront');

async function go(url: string, width = 1280, height = 900) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const loaded = waitLoad();
  await send('Page.navigate', { url });
  await loaded;
  await settle();
}

const KEYS: Record<string, { key: string; code: string; vk: number; text?: string }> = {
  Tab: { key: 'Tab', code: 'Tab', vk: 9 },
  Enter: { key: 'Enter', code: 'Enter', vk: 13, text: '\r' },
  Space: { key: ' ', code: 'Space', vk: 32, text: ' ' },
};
async function press(name: string, modifiers = 0) {
  const k = KEYS[name]!;
  const base = { key: k.key, code: k.code, windowsVirtualKeyCode: k.vk, nativeVirtualKeyCode: k.vk, modifiers };
  await send('Input.dispatchKeyEvent', { type: k.text ? 'keyDown' : 'rawKeyDown', ...base, ...(k.text ? { text: k.text } : {}) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  await settle(120);
}
async function typeText(text: string) {
  await send('Input.insertText', { text });
  await settle(80);
}

interface Focus { uid: number; tag: string; id: string; text: string; href: string | null; fv: boolean; outline: string; inView: boolean; disabled: boolean; role: string | null }
const describe = (): Promise<Focus> =>
  evaluate(`(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    window.__uids = window.__uids || new WeakMap(); window.__uidn = window.__uidn || 0; if (!window.__uids.has(e)) window.__uids.set(e, ++window.__uidn);
    return { uid: window.__uids.get(e), tag: e.tagName.toLowerCase(), id: e.id, text: (e.getAttribute('aria-label') || e.textContent || e.name || '').trim().replace(/\\s+/g, ' ').slice(0, 44),
      href: e.getAttribute('href'), fv: e.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth,
      inView: r.bottom > 0 && r.top < innerHeight && r.width > 0, disabled: !!e.disabled, role: e.getAttribute('role') }; })()`);
const fmt = (f: Focus) => `${f.tag}${f.id ? '#' + f.id : ''} "${f.text}"${f.href ? ' → ' + f.href : ''}  [focus-visible:${f.fv} outline:${f.outline} in-view:${f.inView}]`;

async function tabThrough(count: number, label: string): Promise<Focus[]> {
  const seen: Focus[] = [];
  log(`-- ${label}: ${count} × Tab`);
  for (let i = 1; i <= count; i++) {
    await press('Tab');
    const f = await describe();
    seen.push(f);
    log(`   ${String(i).padStart(2)}. ${fmt(f)}`);
  }
  return seen;
}

const visibleOutline = (f: Focus) => f.fv && f.outline.startsWith('solid') && !f.outline.endsWith(' 0px');

try {
  log('WEB-001E-R1 keyboard walkthrough (real key events via CDP, headless browser; NOT a screen-reader test)');
  log(`Browser: ${exe}`);
  log(`Artifact: ${artifact} (built output with real CSP)   Sandbox: ${sandbox} (local simulator)`);
  log();

  // A. Desktop navigation + skip link
  log('== A. Desktop home: skip link, header navigation ==');
  await go(`${artifact}/en/`);
  const a = await tabThrough(11, 'header and hero');
  check(a[0]!.text.startsWith('Skip to content'), 'first Tab stop is the skip link');
  check(a.every((f) => f.inView), 'every stop is scrolled into view');
  check(a.every(visibleOutline), 'every stop shows a visible focus outline (solid, non-zero)');
  const navText = a.slice(1, 9).map((f) => f.text);
  check(JSON.stringify(navText) === JSON.stringify(['Heisterlux home', 'Product', 'How it works', 'Roadmap', 'Trust', 'Pricing', 'Resources', 'Request early access']), `header order is logical: ${navText.join(' > ')}`);
  check(new Set(a.map((f) => f.uid)).size === a.length, 'no focus trap: all 11 stops are different elements (header and hero CTA are two separate links to the same page)');
  await go(`${artifact}/en/`);
  await press('Tab');
  await press('Enter');
  const afterSkip = await describe();
  log(`   after Enter on skip link: ${fmt(afterSkip)}`);
  check(afterSkip.id === 'main', 'skip link moves focus to <main id="main">');
  await press('Tab');
  const firstAfterSkip = await describe();
  log(`   next Tab after skipping: ${fmt(firstAfterSkip)}`);
  check(!/Product|How it works|Roadmap|Trust|Pricing|Resources/.test(firstAfterSkip.text) && firstAfterSkip.href !== '/en/product/', 'next Tab lands in the page content, not back in the header');
  log();

  // B. Mobile menu
  log('== B. 375 px: menu operable by keyboard without JavaScript ==');
  await go(`${artifact}/en/`, 375, 812);
  const b = await tabThrough(3, 'skip link, brand, menu');
  check(b[2]!.tag === 'summary' && b[2]!.text === 'Menu', 'third stop is the Menu control');
  check(visibleOutline(b[2]!), 'Menu shows a visible focus outline');
  await press('Enter');
  const menuOpen = await evaluate(`document.querySelector('.nav-mobile').open`);
  check(menuOpen === true, 'Enter opens the menu');
  const b2 = await tabThrough(3, 'inside the opened menu');
  check(b2[0]!.text === 'Product' && b2[1]!.text === 'How it works' && b2[2]!.text === 'Roadmap', 'menu links follow in order');
  await go(`${artifact}/en/`, 375, 812);
  await tabThrough(3, 'reload');
  await press('Space');
  check((await evaluate(`document.querySelector('.nav-mobile').open`)) === true, 'Space also opens the menu');
  log();

  // C. Disabled forms (artifact build: FORMS_MODE unset)
  log('== C. Early access page, forms disabled (as on the Vercel preview) ==');
  await go(`${artifact}/en/early-access/`);
  const c = await evaluate(`(() => { const f = [...document.querySelectorAll('fieldset')]; return { fieldsets: f.length, disabled: f.filter(x => x.disabled).length, notice: !!document.querySelector('.notice--warning'), noticeText: document.querySelector('.notice--warning')?.textContent.trim().slice(0, 140) }; })()`);
  log(`   ${JSON.stringify(c)}`);
  check(c.fieldsets === 2 && c.disabled === 2, 'both forms are disabled fieldsets');
  const cStops = await tabThrough(24, 'tab order across the whole page (focus leaves the document after the last link, then returns to the skip link)');
  const wrap = cStops.findIndex((f) => f.tag === 'body');
  check(!cStops.some((f) => ['input', 'textarea', 'button'].includes(f.tag)), 'disabled controls are skipped by Tab (no dead focus stops)');
  check(cStops.every((f) => f.inView), 'every stop is scrolled into view');
  const inDoc = cStops.filter((f) => f.tag !== 'body');
  check(inDoc.every(visibleOutline), 'every in-page stop shows a visible focus outline');
  check(wrap === 22 && cStops[wrap + 1]!.text.startsWith('Skip to content'), 'after the last footer link focus leaves the document (browser UI) and returns to the skip link: no trap');
  check(new Set(cStops.slice(0, wrap).map((f) => f.uid)).size === wrap, 'each in-page element receives focus exactly once per cycle');
  check(cStops.some((f) => f.href === '/en/privacy/'), 'page links (privacy) remain reachable with the forms disabled');
  check(/not accepting submissions/.test(c.noticeText ?? ''), 'a visible notice states that the form is not accepting submissions');
  log();

  // D. Sandbox error flow (local simulator)
  log('== D. Local sandbox: keyboard form flow with errors (simulator, no real email) ==');
  await go(`${sandbox}/en/early-access/`);
  const hint = await evaluate(`[...document.querySelectorAll('.hint')].map(h => h.textContent.trim())`);
  log(`   hints on page: ${JSON.stringify(hint)}`);
  check(hint.some((h: string) => /early access request/.test(h)) && hint.some((h: string) => /confirmation email/.test(h)) && !hint.some((h: string) => /only use this to reply/.test(h)), 'hints are purpose-bound per form');
  // focus the keep-informed email field via keyboard: Tab until it is focused
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await press('Tab');
    const f = await describe();
    if (f.id === 'keep-informed-email') reached = true;
  }
  check(reached, 'Keep me informed email field reachable by Tab');
  await typeText('not-an-email');
  await press('Tab'); // consent checkbox
  const consent = await describe();
  check(consent.id === 'keep-informed-consent', 'next stop is the consent checkbox');
  await press('Tab'); // (honeypot is tabindex -1) -> submit button
  const submit = await describe();
  log(`   focus now: ${fmt(submit)}`);
  check(submit.tag === 'button', 'next stop is the submit button (honeypot is not a tab stop)');
  const nav1 = waitLoad();
  await press('Enter');
  await nav1;
  await settle(300);
  const err = await describe();
  log(`   after submit with errors: ${fmt(err)}`);
  check(err.role === 'alert', 'focus lands on the error summary (role=alert)');
  const summaryLinks = await evaluate(`[...document.querySelectorAll('.error-summary a')].map(a => ({text: a.textContent.trim(), href: a.getAttribute('href')}))`);
  log(`   error summary links: ${JSON.stringify(summaryLinks)}`);
  check(summaryLinks.length >= 2, 'summary lists each problem as a link');
  check(await evaluate(`document.querySelector('#keep-informed-email')?.getAttribute('aria-invalid') === 'true' && !!document.querySelector('#keep-informed-email-error')`), 'invalid field has aria-invalid and an associated error message');
  check((await evaluate(`document.querySelector('#keep-informed-email')?.value`)) === 'not-an-email', 'entered value is kept after the error');
  await press('Tab');
  const link1 = await describe();
  log(`   Tab from summary: ${fmt(link1)}`);
  check(link1.tag === 'a', 'Tab moves into the first summary link');
  await press('Enter');
  await settle(300);
  const target = await describe();
  log(`   after Enter on the link: ${fmt(target)}`);
  check(target.id === 'keep-informed-email', 'Enter on the summary link moves focus to the field in error');
  log();
  log('== E. Local sandbox: recover and succeed ==');
  await evaluate(`document.querySelector('#keep-informed-email').select()`);
  await typeText('synthetic@example.invalid');
  await press('Tab');
  await press('Space'); // tick consent
  check((await evaluate(`document.querySelector('#keep-informed-consent').checked`)) === true, 'Space ticks the consent checkbox');
  await press('Tab');
  const nav2 = waitLoad();
  await press('Enter');
  await nav2;
  await settle(300);
  const done = await evaluate(`({ h1: document.querySelector('h1')?.textContent, notice: document.querySelector('.notice')?.textContent.trim() })`);
  log(`   result: ${JSON.stringify(done)}`);
  check(done.h1 === 'Thank you' && /Local test mode/.test(done.notice ?? ''), 'success page names itself as local test mode (cannot be mistaken for a real confirmation)');
  log();
  log(failures.length === 0 ? 'RESULT: all keyboard checks passed' : `RESULT: ${failures.length} check(s) failed`);
  log('Not covered: screen readers (NVDA/JAWS/VoiceOver/Narrator), switch access, voice control, other browsers.');
} finally {
  ws.close();
  child.kill();
  if (outFile) writeFileSync(outFile, lines.join('\n') + '\n');
}
process.exit(failures.length === 0 ? 0 : 1);
