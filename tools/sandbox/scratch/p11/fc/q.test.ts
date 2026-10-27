import fc from "fast-check";
import { test, expect } from "vitest";
import { parseOrdersQuery, toSearchParams, DEFAULT_QUERY, type OrdersQuery } from "./query";
const arbQuery: fc.Arbitrary<OrdersQuery> = fc.record({
  status: fc.subarray(["cancelled", "open", "shipped"] as const),
  sort: fc.constantFrom("createdAt", "-createdAt", "total", "-total", "status", "-status") as fc.Arbitrary<OrdersQuery["sort"]>,
  size: fc.constantFrom(25, 50, 100) as fc.Arbitrary<OrdersQuery["size"]>,
}, { requiredKeys: ["status", "sort", "size"] });
test("round-trips", () => { fc.assert(fc.property(arbQuery, (q) => { expect(parseOrdersQuery(toSearchParams(q))).toEqual(q); })); });
test("never throws on garbage", () => { fc.assert(fc.property(fc.string(), (s) => { expect(() => parseOrdersQuery(new URLSearchParams(s))).not.toThrow(); })); });
test("defaults", () => { expect(toSearchParams(DEFAULT_QUERY).toString()).toBe(""); });
