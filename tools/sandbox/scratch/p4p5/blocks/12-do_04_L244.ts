// orders/domain.test.ts
import { describe, expect, it } from "vitest";
import { canCancel, cancelled, orderTotal } from "./domain";

describe("canCancel", () => {
  it.each([
    ["placed", true],
    ["draft", false],
    ["dispatched", false],
    ["delivered", false],
    ["cancelled", false],
  ] as const)("status %s → allowed=%s", (status, allowed) => {
    expect(canCancel({ id: "o1", status, lines: [], currency: "EUR" }).allowed).toBe(allowed);
  });
});

it("orderTotal sums line totals exactly", () => {
  const o = { id: "o1", status: "placed", currency: "EUR", lines: [
    { sku: "a", qty: 3, unit: { minor: 1999, currency: "EUR" } },
  ] } as const;
  expect(orderTotal(o).minor).toBe(5997);
});
export {};
