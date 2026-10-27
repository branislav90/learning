export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
import AxeBuilder from "@axe-core/playwright";

test("checkout page has no detectable a11y violations", async ({ page }) => {
  await page.goto("/checkout/shipping");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("cart page visual baseline", async ({ page }) => {
  await page.goto("/cart");
  await expect(page).toHaveScreenshot("cart.png", { maxDiffPixelRatio: 0.01 });
});
