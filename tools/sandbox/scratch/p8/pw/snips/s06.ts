export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
// e2e/checkout.spec.ts
import { expect, test } from "./fixtures";

test("@smoke shopper can buy a product with a promo code", async ({ authedPage: page }) => {
  await test.step("add the product to the cart", async () => {
    await page.goto("/products/espresso-machine");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("status")).toContainText("Added to cart");
    await expect(page.getByRole("banner").getByRole("link", { name: /cart \(1\)/i })).toBeVisible();
  });

  await test.step("apply a promo code", async () => {
    await page.getByRole("banner").getByRole("link", { name: /cart/i }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await page.getByLabel("Promo code").fill("SAVE20");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByTestId("order-total")).toHaveText("$80.00");
  });

  await test.step("pay in the sandbox", async () => {
    await page.getByRole("link", { name: "Checkout" }).click();
    await page.getByLabel("Postcode").fill("12345");
    await page.getByRole("button", { name: "Continue" }).click();

    const card = page.frameLocator("iframe[title='Secure card payment']");   // provider iframe (sandbox)
    await card.getByLabel("Card number").fill("4242 4242 4242 4242");
    await card.getByLabel("Expiry").fill("12 / 34");
    await card.getByLabel("CVC").fill("123");

    const orderResponse = page.waitForResponse((r) => r.url().includes("/api/orders") && r.request().method() === "POST");
    await page.getByRole("button", { name: /pay/i }).click();
    expect((await orderResponse).status()).toBe(201);
  });

  await test.step("see the confirmation", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for your order" })).toBeVisible();
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page).toHaveTitle(/order confirmed/i);
  });
});
