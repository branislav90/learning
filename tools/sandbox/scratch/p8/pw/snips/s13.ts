export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
await page.locator("div.main > div:nth-child(3) button.btn-primary").click();  // ❌
