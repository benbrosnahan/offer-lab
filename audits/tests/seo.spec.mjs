// SEO and what crawlers and AI assistants see in the raw HTML, before any JavaScript.
import { test, expect } from './helpers.mjs';

test('SEO-01 the server HTML carries the page text', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  expect(text).toContain('Is your offer enough to live on?');
  expect(text).toContain('How the numbers work');
  expect(text).toContain('Zumper');
  expect(text).toContain('MIT Living Wage Calculator');
  expect(text.split(/\s+/).filter(Boolean).length).toBeGreaterThan(300);
});

test('SEO-02 title, description, canonical, Open Graph and structured data', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Offer Lab by Cense/);
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(/2026/);
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://offer-lab-ivory.vercel.app');
  expect(await page.locator('meta[property="og:url"]').getAttribute('content')).toBe('https://offer-lab-ivory.vercel.app');
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(ld['@type']).toBe('WebApplication');
  expect(ld.isAccessibleForFree).toBe(true);
});

test('SEO-02 robots.txt and sitemap.xml', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toContain('sitemap.xml');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('https://offer-lab-ivory.vercel.app/');
});

test('SEO-03 metadata has no em dashes and no stale year', async ({ page }) => {
  await page.goto('/');
  const meta = [await page.title(), await page.locator('meta[name="description"]').getAttribute('content')].join(' ');
  expect(meta).not.toMatch(/[—–]/);
  expect(meta).not.toContain('2025');
});
