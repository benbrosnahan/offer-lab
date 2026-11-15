// Shared helpers for the Offer Lab suite. Each test gets a fresh browser context, so storage starts empty.
import { test, expect } from '@playwright/test';

export { test, expect };

export const PHONE = { width: 375, height: 812 };
export const DESKTOP = { width: 1440, height: 900 };
export const STORAGE_KEY = 'offer-lab-state';

/**
 * Marks a test as a known issue from the audit. The test asserts the fixed behaviour, so today it fails and
 * Playwright counts that as expected. Once the issue is fixed, Playwright reports "expected to fail, but passed":
 * delete the knownIssue() call. AUDIT_SHOW_KNOWN=1 runs known issues as ordinary tests, to read the real failure.
 */
export function knownIssue(id) {
  test.info().annotations.push({ type: 'issue', description: id });
  test.fail(!process.env.AUDIT_SHOW_KNOWN, `Known issue ${id}: see the audit report`);
}

/** The app's own share link for one or two offers. */
export const shareLink = state =>
  `/?q=${encodeURIComponent(Buffer.from(JSON.stringify(state)).toString('base64'))}`;

/** Opens the results (or comparison) for an offer through its share link and waits for the answer. */
export async function openOffer(page, a, b) {
  await page.goto(shareLink(b ? { a, b } : { a }));
  await page.locator('main h1').filter({ hasText: /\$|\bor\b|offers/ }).first().waitFor();
}

const dollars = s => (s == null ? null : Number(String(s).replace(/[^\d.-]/g, '')));

/**
 * Reads the monthly figures the page shows for the first offer. Written to work on both the original page
 * (figures as text) and the redesign (rent and costs as fields), so the same test measures before and after.
 */
export async function readFigures(page) {
  const text = await page.locator('main').innerText();
  const grab = re => {
    const m = text.match(re);
    return m ? dollars(m[1].replace(/[−–]/, '-')) : null;
  };
  const field = async sel => ((await page.locator(sel).count()) ? dollars(await page.locator(sel).first().inputValue()) : null);
  return {
    takeHome: grab(/Take-home pay\s*\$([\d,]+)/),
    rent: (await field('#rent-a')) ?? grab(/Rent \(1-bedroom[^)]*\)\s*\$([\d,]+)/),
    essentials: (await field('#essentials-a')) ?? grab(/Essentials[^\n]*\n?\s*\$([\d,]+)/),
    left: grab(/(?:Left|Short) each month\s*([+-]?[−-]?\$[\d,]+)/) ?? grab(/Left over each month\s*([+-]?[−-]?\$[\d,]+)/),
  };
}

/** Opens "Show the math" and returns its lines as { label: monthly dollars }. */
export async function readTaxLines(page) {
  await page.getByText('Show the math').first().click();
  const items = page.locator('details[open] ul li');
  const out = {};
  for (const t of await items.allInnerTexts()) {
    const m = t.match(/^(.*?)\s*-?\$([\d,]+)$/s);
    if (m) out[m[1].trim()] = dollars(m[2]);
  }
  return out;
}
