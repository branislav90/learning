// features/order/model/types.ts
export interface Line { sku: string; unitPriceMinor: number; qty: number }
export interface Order { id: string; lines: readonly Line[] }
export interface Totals { subtotal: number; discount: number; tax: number; total: number } // minor units

// features/order/model/pricing.ts  (pure core: no React, no fetch)
import type { Line, Totals } from "./types";

const TAX_RATE = 0.2;
const COUPONS: Record<string, number> = { SAVE10: 0.1 };

export function calcTotals(lines: readonly Line[], couponCode: string): Totals {
  const subtotal = lines.reduce((s, l) => s + l.unitPriceMinor * l.qty, 0);
  const rate = COUPONS[couponCode.trim().toUpperCase()] ?? 0;
  const discount = Math.round(subtotal * rate);
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}
export {};
