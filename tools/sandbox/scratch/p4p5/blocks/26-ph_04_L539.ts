import { describe, expect, it } from "vitest";
const cart = { currency: "EUR", lines: [{ sku: "a", quantity: 1, unitPriceMinor: 500 }] };
const fake = (impl: OrderGateway["create"]): OrderGateway => ({ create: impl });

it("passes the idempotency key and returns the order id", async () => {
  const seen: string[] = [];
  const place = makePlaceOrder({ orders: fake(async i => { seen.push(i.idempotencyKey); return { orderId: "o1" }; }), newKey: () => "k1" });
  expect(await place(cart)).toEqual({ ok: true, orderId: "o1" });
  expect(seen).toEqual(["k1"]);
});
it("maps network failure without throwing", async () => {
  const place = makePlaceOrder({ orders: fake(async () => { throw new TypeError("offline"); }), newKey: () => "k" });
  expect(await place(cart)).toEqual({ ok: false, reason: "network" });
});
it("rejects empty carts without calling the gateway", async () => {
  let called = false;
  const place = makePlaceOrder({ orders: fake(async () => { called = true; return { orderId: "x" }; }), newKey: () => "k" });
  expect(await place({ ...cart, lines: [] })).toEqual({ ok: false, reason: "empty" });
  expect(called).toBe(false);
});
export {};
