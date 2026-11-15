// Screenshots for the design loop: the form, results and comparison at 375x812 and 1440x900.
// Usage: node scripts/shots.mjs <baseUrl> <outDir> [label]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { OFFER_A, OFFER_B } from '../lib/fixtures.mjs';

const [base = 'http://localhost:3202', out = 'screenshots/after', label = ''] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const q = s => `/?q=${encodeURIComponent(Buffer.from(JSON.stringify(s)).toString('base64'))}`;
const states = [
  ['form', '/'],
  ['results', q({ a: OFFER_A })],
  ['comparison', q({ a: OFFER_A, b: OFFER_B })],
];
const sizes = [['phone', 375, 812], ['desktop', 1440, 900]];
const browser = await chromium.launch();
for (const [size, width, height] of sizes) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: size === 'phone' ? 2 : 1 });
  for (const [name, path] of states) {
    await page.goto(base.replace(/\/$/, '') + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${out}/${label}${name}-${size}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log('saved to', out);
