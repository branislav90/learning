export {};
// e2e/auth.setup.ts
import { expect, test as setup } from "@playwright/test";
import path from "node:path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_USER_EMAIL!);
  await page.getByLabel("Password").fill(process.env.E2E_USER_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/$|\/account/);
  await expect(page.getByRole("button", { name: /account menu/i })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
