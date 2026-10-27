// features/cart/model/selectors.ts  (public hooks; hide the store shape)
import { useCartStore } from "./store";
export const useCartCount = () => useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
export const useCartItems = () => useCartStore((s) => s.items);
export const useAddToCart = () => useCartStore((s) => s.add);
export {};
