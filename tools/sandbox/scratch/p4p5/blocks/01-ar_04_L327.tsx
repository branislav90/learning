// features/cart/model/useCart.ts — no UI imports
import { useCallback } from "react";
import { useCartStore } from "./store";

export function useCart(options?: { onItemAdded?: (sku: string) => void }) {
  const add = useCartStore((s) => s.add);
  const addAndNotify = useCallback(
    (sku: string) => {
      add(sku);
      options?.onItemAdded?.(sku);
    },
    [add, options],
  );
  return { addAndNotify };
}
export {};
