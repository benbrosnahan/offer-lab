// Money: what the page shows against the independent oracle (tests/support/offer-oracle.mjs), which is written
// from the IRS, SSA, state, Zumper and MIT sources and never imports the app. Figures are monthly, and the page
// rounds to whole dollars, so each check allows $1.
import { test, expect, openOffer, readFigures, readTaxLines, knownIssue } from './helpers.mjs';
import {
  PROFILES, expected, fica, mnTax, nycTaxNoCredits, coTax, caTaxHigh, RENT, essentials,
} from './support/offer-oracle.mjs';

function near(shown, want, label) {
  const msg = `${label}: shows ${shown}, oracle ${want.toFixed(2)}`;
  expect(shown, msg).not.toBeNull();
  expect(shown, msg).not.toBeUndefined();
  expect(Math.abs(shown - want), msg).toBeLessThanOrEqual(1);
}

for (const p of PROFILES) {
  const { name, ...offer } = p;
  test.describe(name, () => {
    test('MONEY-02 rent matches Zumper October 2026', async ({ page }) => {
      await openOffer(page, offer);
      near((await readFigures(page)).rent, RENT[offer.cityId], 'rent');
    });

    test('MONEY-01 everyday costs match MIT for the county', async ({ page }) => {
      await openOffer(page, offer);
      near((await readFigures(page)).essentials, essentials(offer.cityId), 'essentials');
    });

    test('MONEY-03 MONEY-04 take-home matches 2026 tax and payroll rules', async ({ page }) => {
      await openOffer(page, offer);
      near((await readFigures(page)).takeHome, expected(offer).takeHomeMonthly, 'take-home');
    });

    test('left over matches', async ({ page }) => {
      await openOffer(page, offer);
      near((await readFigures(page)).left, expected(offer).leftOver, 'left over');
    });
  });
}

test('MONEY-06 Additional Medicare Tax above $200,000', async ({ page }) => {
  await openOffer(page, { salary: 250000, cityId: 'san-francisco-ca', loanPayment: 0, otherFixed: 0 });
  const lines = await readTaxLines(page);
  near(lines['Social Security and Medicare'], fica(250000) / 12, 'FICA');
});

test('MONEY-07 Minnesota deduction phase-out above $337,800', async ({ page }) => {
  await openOffer(page, { salary: 400000, cityId: 'minneapolis-mn', loanPayment: 0, otherFixed: 0 });
  const lines = await readTaxLines(page);
  near(lines['Minnesota income tax'], mnTax(400000) / 12, 'MN tax');
});

test('MONEY-08 NYC school tax credits stop above $500,000 of income', async ({ page }) => {
  await openOffer(page, { salary: 505000, cityId: 'new-york-ny', loanPayment: 0, otherFixed: 0 });
  const lines = await readTaxLines(page);
  near(lines['New York City local tax'], nycTaxNoCredits(505000) / 12, 'NYC tax');
});

test('MONEY-09 Colorado keeps $1,000 of the deduction at $300,000', async ({ page }) => {
  await openOffer(page, { salary: 320000, cityId: 'denver-co', loanPayment: 0, otherFixed: 0 });
  const lines = await readTaxLines(page);
  near(lines['Colorado income tax'], coTax(320000) / 12, 'CO tax');
});

test('MONEY-09 California 1% tax over $1,000,000', async ({ page }) => {
  await openOffer(page, { salary: 1200000, cityId: 'san-francisco-ca', loanPayment: 0, otherFixed: 0 });
  const lines = await readTaxLines(page);
  near(lines['California income tax'], caTaxHigh(1200000) / 12, 'CA tax');
});

test('MONEY-10 Pittsburgh local services tax, Portland Arts Tax and Oregon transit tax', async ({ page }) => {
  await openOffer(page, { salary: 60000, cityId: 'pittsburgh-pa', loanPayment: 0, otherFixed: 0 });
  let lines = await readTaxLines(page);
  near(lines['Pittsburgh local tax'], (0.03 * 60000 + 52) / 12, 'Pittsburgh EIT + LST');
  await openOffer(page, { salary: 70000, cityId: 'portland-or', loanPayment: 0, otherFixed: 0 });
  lines = await readTaxLines(page);
  near(lines['Portland local tax'], 50 / 12, 'Portland Arts Tax');
  near(lines['Statewide transit tax'], (0.001 * 70000) / 12, 'Oregon transit tax');
});

test('MONEY-11 Arkansas low-income table: no tax at $14,000', async ({ page }) => {
  knownIssue('MONEY-11');
  await openOffer(page, { salary: 14000, cityId: 'little-rock-ar', loanPayment: 0, otherFixed: 0 });
  const lines = await readTaxLines(page);
  expect(lines['Arkansas income tax']).toBe(0);
});

test('MONEY-12 utilities are counted somewhere', async ({ page }) => {
  knownIssue('MONEY-12');
  await openOffer(page, PROFILES[0]);
  await expect(page.locator('main')).toContainText(/Utilities\s*\$\d/);
});

test('MONEY-14 a tie is called even, not a win', async ({ page }) => {
  const a = { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 };
  await openOffer(page, a, { ...a });
  await expect(page.locator('main')).toContainText('about even');
  await expect(page.locator('main')).not.toContainText('$0 more');
});

test('editing the rent changes the answer by the same amount', async ({ page }) => {
  const offer = PROFILES[0];
  await openOffer(page, offer);
  const before = (await readFigures(page)).left;
  await page.locator('#rent-a').fill('1800');
  const after = (await readFigures(page)).left;
  expect(after - before).toBe(RENT[offer.cityId] - 1800);
  await page.getByRole('button', { name: /Use the median/ }).click();
  expect((await readFigures(page)).left).toBe(before);
});
