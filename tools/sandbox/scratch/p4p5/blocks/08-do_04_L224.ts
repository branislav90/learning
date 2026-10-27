// shared-kernel/money.ts
export type CurrencyCode = "EUR" | "GBP" | "PLN" | "CZK";

export interface Money {
  readonly minor: number;            // integer minor units (cents)
  readonly currency: CurrencyCode;
}

export function money(minor: number, currency: CurrencyCode): Money {
  if (!Number.isInteger(minor)) throw new RangeError("Money.minor must be an integer");
  return Object.freeze({ minor, currency });
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minor + b.minor, a.currency);
}

export function lte(a: Money, b: Money): boolean {
  assertSameCurrency(a, b);
  return a.minor <= b.minor;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

export function format(m: Money, locale = "en-GB"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: m.currency }).format(m.minor / 100);
}
export {};
