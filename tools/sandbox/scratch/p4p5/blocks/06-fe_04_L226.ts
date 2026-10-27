// features/cart/model/store.ts  (private to the feature)
import { create } from "zustand";
import type { CartItem } from "./types";

interface CartState {
  items: readonly CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (sku: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.sku === item.sku);
      return existing
        ? { items: s.items.map((i) => (i.sku === item.sku ? { ...i, qty: i.qty + 1 } : i)) }
        : { items: [...s.items, { ...item, qty: 1 }] };
    }),
  remove: (sku) => set((s) => ({ items: s.items.filter((i) => i.sku !== sku) })),
}));
export {};
