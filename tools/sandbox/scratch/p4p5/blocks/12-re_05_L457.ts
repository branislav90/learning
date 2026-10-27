export const selectSubtotalCents = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
export {};
