// features/cart/model/useCart.ts
export function useCart(opts?: { onItemAdded?: (sku: string) => void }) { /* as before */ }

// app/useCartWithEffects.ts — composition root adds cross-cutting reactions
import { useCart } from "@/features/cart";
import { track } from "@/shared/analytics";
export function useCartWithEffects(openDrawer: () => void) {
  return useCart({ onItemAdded: (sku) => { track("cart_add", { sku }); openDrawer(); } });
}
export {};
