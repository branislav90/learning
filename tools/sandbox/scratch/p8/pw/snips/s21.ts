export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
test("a failed first order attempt can be retried without duplicates", async ({ page, request, account }) => {
  let attempts = 0;
  await page.route("**/api/orders", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    attempts++;
    if (attempts === 1) {
      return route.fulfill({ status: 500, json: { message: "boom" } });
    }
    return route.continue();
  });

  // ... drive the UI to the payment step (helper), then:
  await page.getByRole("button", { name: /pay/i }).click();
  await expect(page.getByRole("alert")).toContainText(/couldn't place your order/i);

  await page.getByRole("button", { name: /pay/i }).click();            // retry
  await expect(page.getByRole("heading", { name: "Thanks for your order" })).toBeVisible();

  const orders = await request.get(`/api/test/accounts/${account.id}/orders`);   // test-only endpoint
  expect(await orders.json()).toHaveLength(1);                         // no duplicates
});
