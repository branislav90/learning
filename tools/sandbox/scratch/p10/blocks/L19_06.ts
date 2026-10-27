// e2e/checkout-legacy-browser.spec.ts
import { test, expect } from '@playwright/test';

test('checkout works when ES2023 array methods are missing', async ({ page }) => {
  await page.addInitScript(() => {
    // simulate Safari 15: remove APIs newer than our supported baseline BEFORE app scripts run
    for (const m of ['toSorted', 'toReversed', 'toSpliced', 'with', 'findLast', 'findLastIndex', 'at'] as const) {
      // @ts-expect-error deliberate deletion for simulation
      delete Array.prototype[m];
    }
    // @ts-expect-error
    delete Object.hasOwn;
    // @ts-expect-error
    delete globalThis.structuredClone;
  });
  await page.goto('/checkout?flags=checkout.saved-methods:on');
  await expect(page.getByRole('heading', { name: /saved payment methods/i })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});
