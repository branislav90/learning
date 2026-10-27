// After: rule is a pure function, component only presents
// model/pricing.ts
export const withTax = (cents: number, taxRate: number): number =>
  Math.round(cents * (1 + taxRate));

// ui/Price.tsx
import { withTax } from "../model/pricing";
export function Price({ cents, taxRate }: { cents: number; taxRate: number }) {
  return <span>{(withTax(cents, taxRate) / 100).toFixed(2)}</span>;
}
export {};
