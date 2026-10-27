export {};
import { expect, test } from "@playwright/test";

test.describe("login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });           // start logged out

  test("invalid credentials show an accessible error and stay on /login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("ada@example.test");
    await page.getByLabel("Password").fill("wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toContainText(/invalid/i);
    await expect(page).toHaveURL(/\/login$/);
  });

  test("valid credentials land on /account", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(process.env.E2E_USER_EMAIL!);
    await page.getByLabel("Password").fill(process.env.E2E_USER_PASSWORD!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/account$/);
  });

  test("deep link redirects to login and returns after sign-in", async ({ page }) => {
    await page.goto("/account/settings");
    await expect(page).toHaveURL(/\/login\?redirectTo=%2Faccount%2Fsettings/);
    await page.getByLabel("Email").fill(process.env.E2E_USER_EMAIL!);
    await page.getByLabel("Password").fill(process.env.E2E_USER_PASSWORD!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/account\/settings$/);
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });
});
