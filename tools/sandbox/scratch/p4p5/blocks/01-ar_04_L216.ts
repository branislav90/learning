// features/cart/index.ts  (public API of the cart feature)
export { CartButton } from "./ui/CartButton";
export { useCartCount } from "./model/useCartCount";
export type { CartItem } from "./model/types";
// NOT exported: cartReducer, CartStorage, internal selectors
export {};
