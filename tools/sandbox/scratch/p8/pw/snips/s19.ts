export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
test("save profile", async ({ page }) => {
  await page.goto("/profile");
  await page.locator(".input-name").fill("Ada");
  await page.locator("button.save").click();
  await page.waitForTimeout(1000);
  expect(await page.locator(".toast").textContent()).toBe("Saved");
});
