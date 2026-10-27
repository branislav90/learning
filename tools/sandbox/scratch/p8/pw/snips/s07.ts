export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
test("shows a retryable error when the products API fails once", async ({ page }) => {
  let failed = false;
  await page.route("**/api/products*", async (route) => {
    if (!failed) {
      failed = true;
      await route.fulfill({ status: 503, json: { message: "Service unavailable" } });
    } else {
      await route.continue();                    // let the real backend answer on retry
    }
  });

  await page.goto("/products");
  await expect(page.getByRole("alert")).toContainText(/couldn't load products/i);

  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByRole("list", { name: "Products" }).getByRole("listitem").first()).toBeVisible();
});

test("remains usable when analytics is blocked", async ({ page }) => {
  await page.route(/(google-analytics|segment|hotjar)/, (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("offline shows the offline banner", async ({ page, context }) => {
  await page.goto("/dashboard");
  await context.setOffline(true);
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(page.getByRole("alert")).toContainText(/offline/i);
  await context.setOffline(false);
});
