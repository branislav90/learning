// features/search/ResultCard.tsx
import { priceFormatter } from '../../checkout/src/internal/formatters'; // ❌
import { cartStore } from '../../checkout/src/internal/store';           // ❌

export function ResultCard({ sku }: { sku: string }) {
  const qty = cartStore.getState().items[sku]?.qty ?? 0; // couples to checkout's state shape
  // ...
}
