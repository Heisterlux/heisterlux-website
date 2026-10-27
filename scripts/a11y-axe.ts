/**
 * Automated accessibility scan with axe-core (WCAG 2.0/2.1/2.2 A + AA + best practice) over every
 * generated page, in light and dark colour schemes, at desktop and 320 px widths.
 * Usage: node scripts/a11y-axe.ts <artifactBase> [outfile]
 * Automated checks find only part of the possible problems; this is not a conformance claim.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { launch } from './lib/cdp.ts';

const [base, outFile] = process.argv.slice(2);
if (!base) {
  console.error('usage: node scripts/a11y-axe.ts <artifactBase> [outfile]');
  process.exit(2);
}
const STATIC = '.vercel/output/static';
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const pages = walk(STATIC)
  .filter((f) => f.endsWith('.html'))
  .map((f) => '/' + relative(STATIC, f).split(sep).join('/'))
  .map((p) => (p === '/404.html' ? '/does-not-exist/' : p.replace(/index\.html$/, '')))
  .sort();

const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const browser = await launch(9335);
const lines: string[] = [];
const log = (s: string) => {
  lines.push(s);
  console.log(s);
};
let violations = 0;
let incomplete = 0;
log(`axe-core ${JSON.parse(readFileSync('node_modules/axe-core/package.json', 'utf8')).version}; ${pages.length} pages × light/dark × 1280/320 px; tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`);
try {
  for (const page of pages) {
    for (const scheme of ['light', 'dark'] as const) {
      for (const width of [1280, 320]) {
        await browser.go(base + page, { width, height: 900, colorScheme: scheme });
        await browser.evaluate(axeSource);
        const result = await browser.evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } }).then(r => ({ v: r.violations.map(v => v.id + ' (' + v.impact + ') x' + v.nodes.length + ' e.g. ' + v.nodes[0].target.join(' ')), inc: r.incomplete.map(v => v.id + ' x' + v.nodes.length) }))`);
        violations += result.v.length;
        incomplete += result.inc.length;
        if (result.v.length || result.inc.length) log(`${page} [${scheme}, ${width}px] violations: ${JSON.stringify(result.v)} needs-review: ${JSON.stringify(result.inc)}`);
      }
    }
  }
} finally {
  browser.close();
}
log(`SUMMARY: ${pages.length * 4} scans, ${violations} violation entries, ${incomplete} needs-review entries (axe cannot decide these automatically)`);
if (outFile) writeFileSync(outFile, lines.join('\n') + '\n');
process.exit(violations === 0 ? 0 : 1);
