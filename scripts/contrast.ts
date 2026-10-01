/**
 * WCAG contrast check for the colour pairs the design actually uses, in light and dark themes.
 * Reads src/styles/tokens.css. Usage: node scripts/contrast.ts
 */
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const darkStart = css.indexOf('@media (prefers-color-scheme: dark)');
function tokens(block: string): Record<string, string> {
  return Object.fromEntries([...block.matchAll(/--(c-[a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1]!, m[2]!]));
}
const light = tokens(css.slice(0, darkStart));
const dark = { ...light, ...tokens(css.slice(darkStart)) };

function lum(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};

// [foreground, background, minimum, usage]
const PAIRS: [string, string, number, string][] = [
  ['c-text', 'c-bg', 4.5, 'body text'],
  ['c-text-muted', 'c-bg', 4.5, 'muted text / lead'],
  ['c-text-muted', 'c-surface-muted', 4.5, 'muted text on bands and footer'],
  ['c-text', 'c-surface', 4.5, 'card text, SVG labels'],
  ['c-text-muted', 'c-surface', 4.5, 'SVG sublabels in boxes'],
  ['c-text-muted', 'c-accent-soft', 4.5, 'SVG text in accent box'],
  ['c-text', 'c-accent-soft', 4.5, 'SVG label in accent box'],
  ['c-accent', 'c-bg', 4.5, 'links'],
  ['c-accent', 'c-surface-muted', 4.5, 'links on bands'],
  ['c-accent-contrast', 'c-accent', 4.5, 'primary button text'],
  ['c-accent-contrast', 'c-accent-hover', 4.5, 'primary button hover'],
  ['c-accent', 'c-accent-soft', 4.5, 'secondary button hover / step numbers'],
  ['c-pending-text', 'c-pending-bg', 4.5, 'pending markers'],
  ['c-error', 'c-bg', 4.5, 'error text'],
  ['c-error', 'c-error-soft', 4.5, 'error summary'],
  ['c-status-available', 'c-surface', 4.5, 'status badge'],
  ['c-status-in-development', 'c-surface', 4.5, 'status badge'],
  ['c-status-up-next', 'c-surface', 4.5, 'status badge'],
  ['c-status-exploring', 'c-surface', 4.5, 'status badge'],
  ['c-focus', 'c-bg', 3, 'focus ring (non-text)'],
  ['c-border-strong', 'c-surface', 3, 'form field borders (non-text)'],
  ['c-accent', 'c-bg', 3, 'diagram arrows (non-text)'],
];

let failed = 0;
const rows: Record<string, string | number>[] = [];
for (const [theme, t] of [['light', light], ['dark', dark]] as const) {
  for (const [fg, bg, min, usage] of PAIRS) {
    const r = ratio(t[fg]!, t[bg]!);
    const ok = r >= min;
    if (!ok) failed++;
    rows.push({ theme, fg, bg, ratio: Number(r.toFixed(2)), min, result: ok ? 'pass' : 'FAIL', usage });
  }
}
console.table(rows);
if (failed) {
  console.error(`${failed} contrast pair(s) below minimum`);
  process.exit(1);
}
console.log('contrast: PASS');
