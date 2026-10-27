/**
 * Full-page screenshots at real viewport widths (desktop 1280 px, mobile 375 px) via CDP.
 * Usage: node scripts/capture-screenshots.ts <artifactBase> <outDir> <path[,path...]> [light|dark]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch } from './lib/cdp.ts';

const [base, outDir, pathList, scheme = 'light'] = process.argv.slice(2);
if (!base || !outDir || !pathList) {
  console.error('usage: node scripts/capture-screenshots.ts <artifactBase> <outDir> <path[,path...]> [light|dark]');
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });
const browser = await launch(9336);
try {
  for (const path of pathList.split(',')) {
    for (const [label, width] of [['desktop', 1280], ['mobile-375', 375]] as const) {
      await browser.go(base + path, { width, height: 900, colorScheme: scheme as 'light' | 'dark' });
      const height = Math.ceil(await browser.evaluate('document.documentElement.scrollHeight'));
      await browser.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await new Promise((r) => setTimeout(r, 200));
      const shot = await browser.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const name = `${label}${scheme === 'dark' ? '-dark' : ''}-${path.replace(/^\/en\//, '').replace(/\/$/, '').replace(/\//g, '-') || 'home'}.png`;
      writeFileSync(join(outDir, name), Buffer.from(shot.result.data, 'base64'));
      console.log(`${name}  ${width}x${height}`);
    }
  }
} finally {
  browser.close();
}
