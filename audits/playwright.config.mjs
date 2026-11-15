// Playwright suite for Offer Lab. Runs against a production build on port 3202, started automatically from the
// repo root unless something already answers there, or AUDIT_URL points somewhere else (the live site, a preview).
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.AUDIT_PORT || 3202);
const baseURL = process.env.AUDIT_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.mjs/,
  outputDir: './test-results',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: process.env.AUDIT_URL
    ? undefined
    : {
        command: `npm --prefix .. run start -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
