// The core journeys a student takes, through the real UI.
import { test, expect, PHONE, STORAGE_KEY, openOffer, readFigures, shareLink } from './helpers.mjs';

test('home renders the question and the form, with no console errors', async ({ page }) => {
  const errors = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Is your offer enough to live on?');
  await expect(page.getByLabel('Salary in the offer')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'City' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('type an offer, pick a city with the keyboard, see the answer', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/');
  await page.getByLabel('Salary in the offer').fill('65000');
  const city = page.getByRole('combobox', { name: 'City' });
  await city.click();
  await city.pressSequentially('Bost');
  await expect(page.getByRole('option', { name: /Boston/ })).toBeVisible();
  await city.press('ArrowDown');
  await expect(city).toHaveAttribute('aria-activedescendant', /opt-0/);
  await city.press('Enter');
  await expect(city).toHaveValue('Boston, MA');
  await page.getByRole('button', { name: 'See what is left' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('$65,000 in Boston');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#verdict')).toContainText(/each month/);
});

test('submitting an empty form says what is missing', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'See what is left' }).click();
  await expect(page.getByText('Enter the yearly salary from the offer.')).toBeVisible();
  await expect(page.getByText('Pick a city from the list.')).toBeVisible();
  await expect(page.getByLabel('Salary in the offer')).toBeFocused();
});

test('compare a second offer, then remove it', async ({ page }) => {
  await openOffer(page, { salary: 65000, cityId: 'boston-ma', loanPayment: 200, otherFixed: 0 });
  await page.getByRole('button', { name: 'Compare a second offer' }).click();
  await page.getByLabel('Salary in the offer').fill('72000');
  const city = page.getByRole('combobox', { name: 'City' });
  await city.click();
  await city.pressSequentially('Austin');
  await city.press('Enter');
  await page.getByRole('button', { name: 'Compare offers' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Boston or Austin?');
  await expect(page.locator('#answer')).toContainText(/Austin leaves about \$[\d,]+ more each month/);
  // The loan carries over to the second offer.
  await expect(page.locator('#loan-b')).toHaveValue('200');
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('$65,000 in Boston');
});

test('the offer survives a reload and Start over clears it', async ({ page }) => {
  await openOffer(page, { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 });
  await page.locator('#rent-a').fill('1500');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('$65,000 in Boston');
  expect((await readFigures(page)).rent).toBe(1500);
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Is your offer enough to live on?');
  expect(await page.evaluate(k => sessionStorage.getItem(k), STORAGE_KEY)).toBeNull();
  expect(new URL(page.url()).search).toBe('');
});

test('RES-01 a share link for an unknown city falls back to the form with a note', async ({ page }) => {
  await page.goto(shareLink({ a: { salary: 65000, cityId: 'atlantis-xx', loanPayment: 0, otherFixed: 0 } }));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Is your offer enough to live on?');
  await expect(page.getByRole('alert').filter({ hasText: 'could not be opened' })).toBeVisible();
});

test('RES-01 a malformed share link falls back to the form', async ({ page }) => {
  await page.goto('/?q=not-base64%%%');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Is your offer enough to live on?');
  await expect(page.getByLabel('Salary in the offer')).toBeVisible();
});

for (const width of [320, 375, 768, 1440]) {
  test(`nothing scrolls sideways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', shareLink({ a: { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 }, b: { salary: 72000, cityId: 'new-york-ny', loanPayment: 0, otherFixed: 0 } })]) {
      await page.goto(path);
      await page.locator('main h1').waitFor();
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(over, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}
