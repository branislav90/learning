export {};
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.ts/,          // keep Vitest's *.test.ts separate from Playwright's *.spec.ts
  fullyParallel: true,
  forbidOnly: CI,                     // fail CI if someone committed test.only
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined,        // tune to your runner's CPU; fewer workers = less contention flake
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
    timezoneId: "UTC",
    testIdAttribute: "data-testid",
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 14"], storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
      grep: /@smoke/,                  // run only smoke tests on the extra project to save time
    },
    // add firefox/webkit desktop if your support policy requires it
  ],

  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
