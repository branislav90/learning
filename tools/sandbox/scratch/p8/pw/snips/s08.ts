export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
test("keyboard-only user can open and close the cart drawer and focus returns", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /open cart/i });

  await page.keyboard.press("Tab");           // move to the first focusable element (skip link)
  await trigger.focus();
  await page.keyboard.press("Enter");

  const drawer = page.getByRole("dialog", { name: /your cart/i });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: /close/i })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();         // focus restored
});
