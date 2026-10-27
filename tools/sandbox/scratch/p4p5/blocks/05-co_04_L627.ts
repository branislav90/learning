import { useCallback, useRef } from "react";
export function useCart(options?: { onItemAdded?: (sku: string) => void }) {
  const add = useCartStore((s) => s.add);
  const cbRef = useRef(options?.onItemAdded);
  cbRef.current = options?.onItemAdded;           // write during render: see caveat
  return { addAndNotify: useCallback((sku: string) => { add(sku); cbRef.current?.(sku); }, [add]) };
}
export {};
