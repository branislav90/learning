// domain/checkoutRules.ts  (pure; trivially unit-testable)
export type Cart = { lines: { sku: string; qty: number; unitPriceCents: number }[] };
export type Check = { ok: true } | { ok: false; reason: "EMPTY_CART" | "BELOW_MINIMUM" };

export const totalCents = (c: Cart) => c.lines.reduce((s, l) => s + l.qty * l.unitPriceCents, 0);

export function canPlaceOrder(cart: Cart, minimumCents: number): Check {
  if (cart.lines.length === 0) return { ok: false, reason: "EMPTY_CART" };
  if (totalCents(cart) < minimumCents) return { ok: false, reason: "BELOW_MINIMUM" };
  return { ok: true };
}
export {};
