// Accessibility: axe on every state at phone and desktop width, and the Cense floors (40px targets, 13px type).
import AxeBuilder from '@axe-core/playwright';
import { test, expect, PHONE, DESKTOP, shareLink } from './helpers.mjs';

const A = { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 };
const B = { salary: 72000, cityId: 'new-york-ny', loanPayment: 0, otherFixed: 0 };

const STATES = {
  form: async page => page.goto('/'),
  'form with bills open': async page => {
    await page.goto('/');
    await page.getByRole('button', { name: /Add a loan payment/ }).click();
  },
  'city list open': async page => {
    await page.goto('/');
    await page.getByRole('combobox', { name: 'City' }).click();
  },
  results: async page => page.goto(shareLink({ a: A })),
  'results with the math open': async page => {
    await page.goto(shareLink({ a: A }));
    await page.getByText('Show the math').click();
  },
  'results with roommates': async page => page.goto(shareLink({ a: { ...A, roommates: 2 } })),
  comparison: async page => page.goto(shareLink({ a: A, b: B })),
};

for (const [size, viewport] of [['phone', PHONE], ['desktop', DESKTOP]]) {
  for (const [name, enter] of Object.entries(STATES)) {
    test(`A11Y axe finds no WCAG 2.2 AA violations: ${name}, ${size}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await enter(page);
      await page.locator('main h1').waitFor();
      await page.waitForTimeout(800); // let the entrance finish so colours are final
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}

test('A11Y-04 every control is at least 40px tall', async ({ page }) => {
  await page.setViewportSize(PHONE);
  for (const enter of Object.values(STATES)) {
    await enter(page);
    await page.locator('main h1').waitFor();
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, input, summary, [role="option"]')]
        .filter(el => el.offsetParent !== null)
        .map(el => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.height > 0 && r.height < 40)
        .map(({ el, r }) => `${el.tagName} "${(el.innerText || el.id || '').slice(0, 30)}" ${Math.round(r.height)}px`)
    );
    expect(small).toEqual([]);
  }
});

test('A11Y-05 no text below 13px, and headings do not skip levels', async ({ page }) => {
  for (const enter of [STATES.form, STATES.results, STATES.comparison]) {
    await enter(page);
    await page.locator('main h1').waitFor();
    const tiny = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter(el => el.offsetParent !== null && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
        .filter(el => parseFloat(getComputedStyle(el).fontSize) < 13)
        .map(el => `${el.tagName} "${el.textContent.trim().slice(0, 30)}"`)
    );
    expect(tiny).toEqual([]);
    const levels = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4')].map(h => Number(h.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  }
});
