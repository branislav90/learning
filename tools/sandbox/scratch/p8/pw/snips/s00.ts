export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
// ❌ checks once, immediately
expect(await page.getByRole("status").textContent()).toBe("Saved");

// ✔ retries until it's true or times out
await expect(page.getByRole("status")).toHaveText("Saved");
