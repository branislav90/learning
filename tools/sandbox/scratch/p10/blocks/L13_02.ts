// src/features/cart/cart-store.ts — the abstraction consumers depend on
export interface CartItem { sku: string; qty: number }
export interface CartApi {
  items: readonly CartItem[];
  add(sku: string, qty?: number): void;
  remove(sku: string): void;
}
