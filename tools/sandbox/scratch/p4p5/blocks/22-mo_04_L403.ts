export type CurrencyCode = "EUR" | "GBP" | "PLN" | "CZK";

declare const brand: unique symbol;
export type Money = Readonly<{ minor: number; currency: CurrencyCode }> & { readonly [brand]?: true };

export function money(minor: number, currency: CurrencyCode): Money {
  if (!Number.isSafeInteger(minor)) throw new RangeError(`Money.minor must be a safe integer, got ${minor}`);
  return Object.freeze({ minor, currency });
}

export function add(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new TypeError(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  return money(a.minor + b.minor, a.currency);
}

export function format(m: Money, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: m.currency }).format(m.minor / 100);
}
export {};
