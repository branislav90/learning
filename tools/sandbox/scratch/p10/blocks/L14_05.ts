// checkout/src/index.ts exports:
export function useCartQuantity(sku: string): number { /* implementation private */ }

// search/ResultCard.tsx
import { useCartQuantity } from '@acme/feature-checkout';

export function ResultCard({ sku }: { sku: string }) {
  const qty = useCartQuantity(sku);
  // ...
}
