/**
 * Screenshot of one element (by CSS selector) at a given width.
 * Usage: node scripts/capture-element.ts <url> <selector> <width> <outfile>
 */
import { writeFileSync } from 'node:fs';
import { launch } from './lib/cdp.ts';

const [url, selector, widthArg, outFile] = process.argv.slice(2);
if (!url || !selector || !widthArg || !outFile) {
  console.error('usage: node scripts/capture-element.ts <url> <selector> <width> <outfile>');
  process.exit(2);
}
const browser = await launch(9337);
try {
  await browser.go(url, { width: Number(widthArg), height: 900 });
  const rect = await browser.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); e.scrollIntoView(); const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`);
  const pad = 16;
  const clip = { x: Math.max(0, rect.x - pad), y: Math.max(0, rect.y - pad), width: rect.width + pad * 2, height: rect.height + pad * 2, scale: 2 };
  const shot = await browser.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
  writeFileSync(outFile, Buffer.from(shot.result.data, 'base64'));
  console.log(`${outFile} ${Math.round(clip.width)}x${Math.round(clip.height)} @2x`);
} finally {
  browser.close();
}
