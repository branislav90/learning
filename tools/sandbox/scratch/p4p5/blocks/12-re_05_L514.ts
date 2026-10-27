import { cartReducer, initialCart } from "./cart";

test("adding the same sku twice increments quantity", () => {
  const shoe = { sku: "S1", name: "Shoe", unitPriceCents: 5000 };
  const a = cartReducer(initialCart, { type: "itemAdded", item: shoe });
  const b = cartReducer(a, { type: "itemAdded", item: shoe });
  expect(b.items).toEqual([{ ...shoe, quantity: 2 }]);
});

test("does not mutate its input", () => {
  const frozen = Object.freeze({ ...initialCart, items: Object.freeze([]) });
  expect(() => cartReducer(frozen, { type: "couponApplied", code: "X" })).not.toThrow();
});

test("no-op returns the same reference", () => {
  expect(cartReducer(initialCart, { type: "couponCleared" })).toBe(initialCart);
});
export {};
