export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
test("session expiry banner appears after 15 minutes of inactivity", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T09:00:00Z") });     // fake Date/timers in the page
  await page.goto("/dashboard");
  await page.clock.fastForward("15:01");                                   // jump forward; timers fire as needed
  await expect(page.getByRole("dialog", { name: /session expired/i })).toBeVisible();
});
