import { chromium } from '@playwright/test';
import { PROFILES, expected } from '../tests/support/offer-oracle.mjs';
const base = process.argv[2] || 'https://offer-lab-ivory.vercel.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
for (const p of PROFILES) {
  const { name, ...offer } = p;
  const q = Buffer.from(JSON.stringify({ a: offer })).toString('base64');
  await page.goto(`${base}/?q=${encodeURIComponent(q)}`);
  await page.waitForTimeout(1500);
  const text = await page.locator('main').innerText();
  const grab = re => (text.match(re) || [])[1];
  const e = expected(p);
  console.log(JSON.stringify({ name, shown: {
    takeHome: grab(/Take-home pay\s*\$([\d,]+)/), rent: grab(/Rent \(1-bedroom[^)]*\)\s*\$([\d,]+)/),
    essentials: grab(/Essentials[^\n]*\n?\s*\$([\d,]+)/), leftOver: grab(/Left over each month\s*([+-]?-?\$[\d,]+)/),
    verdict: grab(/\n(Tight squeeze|Living lean|Comfortable|Strong cushion)\n/),
  }, expected: { takeHome: Math.round(e.takeHomeMonthly), rent: e.rent, essentials: e.essentials, leftOver: Math.round(e.leftOver) } }));
}
await browser.close();
