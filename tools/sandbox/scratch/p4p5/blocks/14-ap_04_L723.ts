// features/orders/api/endpoints.test.ts (Vitest + MSW 2.x style; ⚠ verify API for your version)
import { http as mswHttp, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
import { fetchOrder } from "./endpoints";
import { ApiException } from "@/platform/http";

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("maps the wire format to the domain model", async () => {
  server.use(
    mswHttp.get("*/orders/o_1", () =>
      HttpResponse.json({ order_id: "o_1", total_amount: "12.50", currency: "EUR",
                          created: "2025-03-01T10:00:00Z", state: "PAID" }),
    ),
  );
  const order = await fetchOrder("o_1");
  expect(order).toMatchObject({ id: "o_1", total: { amountMinor: 1250, currency: "EUR" }, status: "paid" });
});

it("reports contract drift as a contract error, not a crash downstream", async () => {
  server.use(mswHttp.get("*/orders/o_1", () => HttpResponse.json({ orderId: "o_1" })));   // renamed field
  await expect(fetchOrder("o_1")).rejects.toMatchObject({ error: { kind: "contract" } });
});

it("maps 404 to not_found", async () => {
  server.use(mswHttp.get("*/orders/missing", () => new HttpResponse(null, { status: 404 })));
  await expect(fetchOrder("missing")).rejects.toBeInstanceOf(ApiException);
});
export {};
