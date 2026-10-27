import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartItem { id: string; priceCents: number; qty: number }
interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id)
            ? { items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)) }
            : { items: [...s.items, { ...item, qty: 1 }] },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
    }),
    {
      name: 'cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export const selectTotalCents = (s: CartState) => s.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
// usage: const total = useCart(selectTotalCents);  // primitive => stable
export {};
