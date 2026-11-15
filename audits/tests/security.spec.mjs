// Security headers and data handling. Headers are only meaningful on a production server.
import { test, expect, shareLink } from './helpers.mjs';

test('SEC-01 security headers are set', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['content-security-policy']).toContain("default-src 'self'");
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['permissions-policy']).toContain('camera=()');
  expect(h['x-powered-by']).toBeUndefined();
});

test('a full journey makes no request to another site', async ({ page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  const foreign = [];
  page.on('request', r => {
    const u = new URL(r.url());
    if (!['data:', 'blob:'].includes(u.protocol) && u.origin !== origin) foreign.push(r.url());
  });
  await page.goto(shareLink({
    a: { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 },
    b: { salary: 72000, cityId: 'new-york-ny', loanPayment: 0, otherFixed: 0 },
  }));
  await page.locator('#answer').waitFor();
  await page.locator('#rent-a').fill('1800');
  expect(foreign).toEqual([]);
});

test('a share link cannot inject markup', async ({ page }) => {
  let dialogs = 0;
  page.on('dialog', d => { dialogs++; d.dismiss(); });
  await page.goto(shareLink({ a: { salary: 65000, cityId: '<img src=x onerror=alert(1)>', loanPayment: 0, otherFixed: 0 } }));
  await page.locator('main h1').waitFor();
  expect(dialogs).toBe(0);
  await expect(page.locator('main img')).toHaveCount(0);
});
