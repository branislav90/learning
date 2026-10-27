export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
await page.getByRole("button", { name: "Save" }).click();
await expect(page.getByRole("status")).toHaveText("Saved");
