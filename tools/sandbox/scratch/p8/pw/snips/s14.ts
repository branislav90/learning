export {};
import { test, expect, type Page } from "@playwright/test";
declare const page: Page;
const count = await page.evaluate(() => (window as any).__STORE__.cart.items.length);   // ❌ couples to internals
