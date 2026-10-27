export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
import { expect, test } from "./fixtures";

test("signed-in shopper completes checkout", async ({ page, account }) => {
  await page.goto("/products/espresso-machine");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("link", { name: /cart/i }).click();
  await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
  await page.getByRole("link", { name: "Checkout" }).click();
  // … shipping, payment (sandbox iframe) …
  await expect(page.getByRole("heading", { name: "Thanks for your order" })).toBeVisible();
});
