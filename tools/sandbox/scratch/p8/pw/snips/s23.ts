export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
test("admin price edit is visible on the public product page", async ({ page, seededProduct }) => {
  await page.goto(`/admin/products/${seededProduct.id}`);
  await page.getByLabel("Price").fill("12.50");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");

  await page.goto(`/products/${seededProduct.sku}`);
  await expect(page.getByTestId("price")).toHaveText("$12.50");
});
