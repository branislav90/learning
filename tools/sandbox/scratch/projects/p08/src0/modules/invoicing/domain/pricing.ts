import type { LineItem } from './invoice'
// modules/invoicing/domain/pricing.ts
// Money in integer minor units; rates in basis points; quantities in milli-units. No floating point.
export function lineNet(l: LineItem): number {
  return Math.round((l.quantityMilli * l.unitPriceCents) / 1000)
}
export function lineTax(l: LineItem): number {
  return Math.round((lineNet(l) * l.taxRateBp) / 10_000)
}
export function totals(lines: readonly LineItem[]) {
  const net = lines.reduce((s, l) => s + lineNet(l), 0)
  const tax = lines.reduce((s, l) => s + lineTax(l), 0)
  return { net, tax, gross: net + tax }
}
