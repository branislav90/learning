export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
await page.getByRole("button", { name: "Save" }).click();
await page.waitForTimeout(2000);                                   // ❌ guess
expect(await page.locator(".toast").innerText()).toBe("Saved");    // ❌ no retry, CSS-coupled
