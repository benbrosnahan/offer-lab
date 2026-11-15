// Copy: plain words, no certainty about money, no em dashes or tildes, nothing stale.
import { test, expect, openOffer, shareLink } from './helpers.mjs';
import { PROFILES } from './support/offer-oracle.mjs';

const views = {
  form: async page => page.goto('/'),
  results: async page => openOffer(page, PROFILES[0]),
  comparison: async page => openOffer(page, PROFILES[0], PROFILES[2]),
};

for (const [name, enter] of Object.entries(views)) {
  test(`no em dashes, tildes, emojis or 2025 figures: ${name}`, async ({ page }) => {
    await enter(page);
    await page.locator('main h1').waitFor();
    await page.locator('details').evaluateAll(ds => ds.forEach(d => (d.open = true)));
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/[—–~]/);
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(text).not.toMatch(/\b2025\b/);
    expect(text).not.toContain('Loan Lab');
  });
}

test('MONEY-05 the verdict never promises an outcome', async ({ page }) => {
  for (const p of PROFILES) {
    await openOffer(page, p);
    const verdict = await page.locator('#verdict').locator('..').innerText();
    expect(verdict).not.toMatch(/without stress|you're in good shape|you can survive|real savings|guarantee/i);
    expect(verdict).toMatch(/median|estimate|if your rent|your own numbers|you would really pay/i);
  }
});

test('MONEY-13 the math says what take-home leaves out', async ({ page }) => {
  await openOffer(page, PROFILES[0]);
  await page.getByText('Show the math').click();
  await expect(page.locator('main')).toContainText('401(k)');
});

test('MONEY-15 the loan field points to Loan Desk', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Add a loan payment/ }).click();
  await expect(page.getByRole('link', { name: 'Loan Desk' })).toHaveAttribute('href', 'https://cense-loan-desk.vercel.app');
});
