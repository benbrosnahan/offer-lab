// SCOPE-01: splitting rent with roommates, and MONEY-12: electricity, checked against hand-worked cases.
// Every expected value below is worked by hand from the sources in tests/support/offer-oracle.mjs (Zumper October
// 2026 1- and 2-bedroom medians, HUD FY2026 Fair Market Rents, EIA 2024 Table 5A), never from the app.
import { test, expect, PHONE, openOffer, readFigures, shareLink } from './helpers.mjs';
import { expected, rentShare, electricity } from './support/offer-oracle.mjs';

const near = (shown, want, label) => {
  expect(shown, `${label}: shows ${shown}, want ${want}`).not.toBeNull();
  expect(Math.abs(shown - want), `${label}: shows ${shown}, want ${want}`).toBeLessThanOrEqual(1);
};

// Hand-worked. Take-home is the oracle's 2026 figure (Boston: (65,000 - 5,620 - 4,972.50 - 2,930 - 299) / 12 =
// 4,264.88; the README of the audit shows the working). Rent share and electricity:
//
// Boston, $65,000, everyday costs 1,872 (MIT Suffolk County)
//   0 roommates: rent 2,980 (Zumper 1BR); electricity 167.20 -> 167; left 4,264.88 - 2,980 - 167 - 1,872 = -754.12
//   1 roommate:  rent 3,500 / 2 = 1,750 (Zumper 2BR); electricity 167.20 / 2 = 83.60 -> 84;
//                left 4,264.88 - 1,750 - 84 - 1,872 = 558.88
//   2 roommates: 3BR = 3,500 x 3,526 / 2,941 = 4,196.19 (HUD 3BR / 2BR); / 3 = 1,398.73 -> 1,399;
//                electricity 167.20 / 3 = 55.73 -> 56; left 4,264.88 - 1,399 - 56 - 1,872 = 937.88
//   3 roommates: 4BR = 3,500 x 3,894 / 2,941 = 4,634.14; / 4 = 1,158.53 -> 1,159; electricity 41.80 -> 42
// New York City, $72,000, $300 loan
//   0: rent 4,610; electricity 139.53 -> 140
//   1: rent 5,470 / 2 = 2,735; electricity 69.77 -> 70
//   2: 5,470 x 3,644 / 2,910 = 6,849.79; / 3 = 2,283.26 -> 2,283; electricity 46.51 -> 47
// Austin, $58,000
//   0: rent 1,510; electricity 163.72 -> 164
//   1: rent 1,970 / 2 = 985; electricity 81.86 -> 82
//   2: 1,970 x 2,347 / 1,852 = 2,496.54; / 3 = 832.18 -> 832; electricity 54.57 -> 55
// Ann Arbor (not in the Zumper report), 1 roommate:
//   2BR = 1,550 x 1,656 / 1,387 = 1,850.61 (HUD 2BR / 1BR); / 2 = 925.30 -> 925; electricity 119.31 / 2 = 59.65 -> 60
const CASES = [
  { cityId: 'boston-ma', salary: 65000, loanPayment: 0, roommates: 0, rent: 2980, elec: 167, left: -754.12 },
  { cityId: 'boston-ma', salary: 65000, loanPayment: 0, roommates: 1, rent: 1750, elec: 84, left: 558.88 },
  { cityId: 'boston-ma', salary: 65000, loanPayment: 0, roommates: 2, rent: 1399, elec: 56, left: 937.88 },
  { cityId: 'boston-ma', salary: 65000, loanPayment: 0, roommates: 3, rent: 1159, elec: 42 },
  { cityId: 'new-york-ny', salary: 72000, loanPayment: 300, roommates: 0, rent: 4610, elec: 140 },
  { cityId: 'new-york-ny', salary: 72000, loanPayment: 300, roommates: 1, rent: 2735, elec: 70 },
  { cityId: 'new-york-ny', salary: 72000, loanPayment: 300, roommates: 2, rent: 2283, elec: 47 },
  { cityId: 'austin-tx', salary: 58000, loanPayment: 0, roommates: 0, rent: 1510, elec: 164 },
  { cityId: 'austin-tx', salary: 58000, loanPayment: 0, roommates: 1, rent: 985, elec: 82 },
  { cityId: 'austin-tx', salary: 58000, loanPayment: 0, roommates: 2, rent: 832, elec: 55 },
  { cityId: 'ann-arbor-mi', salary: 60000, loanPayment: 0, roommates: 1, rent: 925, elec: 60 },
];

test('SCOPE-01 the oracle agrees with the hand-worked rent and electricity', () => {
  for (const c of CASES) {
    expect(rentShare(c.cityId, c.roommates), `${c.cityId} ${c.roommates} rent`).toBe(c.rent);
    expect(electricity(c.cityId, c.roommates), `${c.cityId} ${c.roommates} electricity`).toBe(c.elec);
    if (c.left !== undefined) {
      const e = expected({ ...c, otherFixed: 0 });
      expect(Math.abs(e.leftOver - c.left), `${c.cityId} ${c.roommates} left`).toBeLessThan(0.01);
    }
  }
});

for (const c of CASES) {
  test(`SCOPE-01 ${c.cityId}, ${c.roommates} roommate(s): rent share, electricity and left over`, async ({ page }) => {
    const { rent, elec, left, roommates, ...base } = c;
    const offer = { ...base, otherFixed: 0, ...(roommates ? { roommates } : {}) };
    await openOffer(page, offer);
    const f = await readFigures(page);
    near(f.rent, rent, 'rent');
    near(f.electricity, elec, 'electricity');
    if (c.cityId !== 'ann-arbor-mi') {
      near(f.left, expected({ ...offer, roommates }).leftOver, 'left over');
      if (left !== undefined) near(f.left, left, 'left over, hand-worked');
    }
    await expect(page.getByRole('radio', { name: roommates ? String(roommates) : 'None' })).toBeChecked();
  });
}

test('SCOPE-01 picking roommates updates rent, electricity, the left-over line and the verdict', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await openOffer(page, { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 });
  await expect(page.locator('#verdict')).toContainText('About $754 short each month');
  await page.getByRole('radio', { name: '2' }).check();
  let f = await readFigures(page);
  expect(f.rent).toBe(1399);
  expect(f.electricity).toBe(56);
  expect(f.left).toBe(938);
  await expect(page.locator('#verdict')).toContainText('About $938 left each month');
  await expect(page.locator('main')).toContainText('split 3 ways');
  // Arrow keys move through the group like any radio group.
  await page.getByRole('radio', { name: '2' }).press('ArrowLeft');
  await expect(page.getByRole('radio', { name: '1' })).toBeChecked();
  f = await readFigures(page);
  expect(f.left).toBe(559);
  // Back to living alone.
  await page.getByRole('radio', { name: 'None' }).check();
  expect((await readFigures(page)).left).toBe(-754);
});

test('SCOPE-01 your own rent share wins over the estimate, and the reset offers the shared estimate', async ({ page }) => {
  await openOffer(page, { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 });
  await page.locator('#rent-a').fill('1200');
  await page.getByRole('radio', { name: '1' }).check();
  let f = await readFigures(page);
  expect(f.rent).toBe(1200); // the student's own number stays
  expect(f.electricity).toBe(84); // electricity still splits
  expect(f.left).toBe(Math.round(4264.875 - 1200 - 84 - 1872));
  await page.getByRole('button', { name: 'Use the estimate, $1,750' }).click();
  f = await readFigures(page);
  expect(f.rent).toBe(1750);
});

test('SCOPE-01 roommates survive a share link and a reload, and carry to a second offer', async ({ page }) => {
  await openOffer(page, { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 });
  await page.getByRole('radio', { name: '2' }).check();
  await page.goto('/');
  await expect(page.getByRole('radio', { name: '2' })).toBeChecked();
  await page.getByRole('button', { name: 'Compare a second offer' }).click();
  await page.getByLabel('Salary in the offer').fill('58000');
  const city = page.getByRole('combobox', { name: 'City' });
  await city.click();
  await city.pressSequentially('Austin');
  await city.press('Enter');
  await page.getByRole('button', { name: 'Compare offers' }).click();
  await expect(page.locator('#rent-b')).toHaveValue('832');
  await expect(page.locator('#electricity-b')).toHaveValue('55');
});

test('SCOPE-01 a share link with a bad roommates value opens as living alone', async ({ page }) => {
  for (const roommates of [7, 1.5, -1, '2']) {
    await page.goto(shareLink({ a: { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0, roommates } }));
    await page.locator('#rent-a').waitFor();
    expect((await readFigures(page)).rent, `roommates ${JSON.stringify(roommates)}`).toBe(2980);
    await expect(page.getByRole('radio', { name: 'None' })).toBeChecked();
  }
});
