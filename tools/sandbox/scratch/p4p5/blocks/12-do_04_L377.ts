// basket/domain.ts
export interface PricedBasket { subtotal: Money; discount: Money; total: Money }

const DISCOUNT_THRESHOLD = money(10_000, "EUR");   // illustrative business constants; confirm with product
const DISCOUNT_RATE_PERCENT = 10;

export function priceBasket(items: readonly Line[]): PricedBasket {
  const subtotal = items.reduce((s, l) => add(s, money(l.unit.minor * l.qty, l.unit.currency)), money(0, "EUR"));
  const discount = subtotal.minor > DISCOUNT_THRESHOLD.minor
    ? money(Math.round((subtotal.minor * DISCOUNT_RATE_PERCENT) / 100), "EUR")
    : money(0, "EUR");
  return { subtotal, discount, total: money(subtotal.minor - discount.minor, "EUR") };
}
export {};
