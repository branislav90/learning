export {};
// e2e/pages/CartPage.ts (a light page object: encapsulates locators and user-level actions)
import { expect, type Page } from "@playwright/test";

export class CartPage {
  constructor(private readonly page: Page) {}
  heading = () => this.page.getByRole("heading", { name: "Your cart" });
  async open() { await this.page.goto("/cart"); await expect(this.heading()).toBeVisible(); }
  async applyPromo(code: string) {
    await this.page.getByLabel("Promo code").fill(code);
    await this.page.getByRole("button", { name: "Apply" }).click();
  }
  total = () => this.page.getByTestId("order-total");
}
