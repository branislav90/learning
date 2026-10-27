export {};
// e2e/fixtures.ts
import { test as base, expect, type APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";

export interface Account { id: string; email: string; password: string }

async function createAccount(request: APIRequestContext): Promise<Account> {
  const email = `e2e+${randomUUID()}@example.test`;
  const res = await request.post("/api/test/accounts", { data: { email, password: "Passw0rd!" } });
  expect(res.ok(), `create account failed: ${res.status()} ${await res.text()}`).toBeTruthy();
  return { ...(await res.json()), email, password: "Passw0rd!" };
}

export const test = base.extend<{ account: Account; authedPage: import("@playwright/test").Page }>({
  account: async ({ request }, use) => {
    const account = await createAccount(request);
    await use(account);
    await request.delete(`/api/test/accounts/${account.id}`);
  },

  // A page already logged in as THIS test's own account (no UI login)
  authedPage: async ({ browser, account, baseURL }, use) => {
    const context = await browser.newContext({ baseURL });
    const resp = await context.request.post("/api/test/login", { data: { email: account.email } }); // test-only endpoint
    expect(resp.ok()).toBeTruthy();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
