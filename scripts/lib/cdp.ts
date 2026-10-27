/**
 * Minimal Chrome DevTools Protocol driver for headless Edge/Chrome (no downloads, no extra
 * dependencies; uses Node's global WebSocket). Shared by scripts/a11y-axe.ts and
 * scripts/capture-screenshots.ts.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];

export interface Cdp {
  exe: string;
  send(method: string, params?: object): Promise<any>;
  evaluate(expression: string): Promise<any>;
  go(url: string, opts?: { width?: number; height?: number; colorScheme?: 'light' | 'dark' }): Promise<void>;
  close(): void;
}

export async function launch(port = 9334): Promise<Cdp> {
  const exe = BROWSERS.find((p) => existsSync(p));
  if (!exe) throw new Error('No Edge/Chrome found');
  const profile = mkdtempSync(join(tmpdir(), 'cdp-'));
  const child: ChildProcess = spawn(exe, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });

  let ws: WebSocket | undefined;
  for (let i = 0; i < 60 && !ws; i++) {
    try {
      const list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
      const page = list.find((t) => t.type === 'page');
      if (page) {
        const socket = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise<void>((res, rej) => {
          socket.onopen = () => res();
          socket.onerror = () => rej(new Error('ws error'));
        });
        ws = socket;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!ws) throw new Error('Could not connect to the browser');
  const socket = ws;

  let nextId = 1;
  const pending = new Map<number, (v: any) => void>();
  const loadWaiters: (() => void)[] = [];
  socket.onmessage = (ev) => {
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
      socket.send(JSON.stringify({ id, method, params }));
    });
  await send('Page.enable');
  await send('Runtime.enable');

  return {
    exe,
    send,
    evaluate: async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value,
    async go(url, { width = 1280, height = 900, colorScheme = 'light' } = {}) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: colorScheme }] });
      const loaded = new Promise<void>((res) => {
        loadWaiters.push(res);
        setTimeout(res, 8000);
      });
      await send('Page.navigate', { url });
      await loaded;
      await new Promise((r) => setTimeout(r, 250));
    },
    close() {
      socket.close();
      child.kill();
    },
  };
}
