// cartStore.ts
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export interface Line { productId: number; unitPrice: number; qty: number }

interface CartState {
  lines: Line[];
  add: (productId: number, unitPrice: number) => void;
  setQty: (productId: number, qty: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        lines: [],
        add: (productId, unitPrice) =>
          set(
            (s) => {
              const hit = s.lines.find((l) => l.productId === productId);
              return {
                lines: hit
                  ? s.lines.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l))
                  : [...s.lines, { productId, unitPrice, qty: 1 }],
              };
            },
            undefined,
            'cart/add',               // devtools action name (verify signature)
          ),
        setQty: (productId, qty) =>
          set((s) => ({
            lines: s.lines
              .map((l) => (l.productId === productId ? { ...l, qty } : l))
              .filter((l) => l.qty > 0),
          })),
        clear: () => set({ lines: [] }),
      }),
      {
        name: 'cart-v1',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: (s) => ({ lines: s.lines }),   // never persist functions/transient state
      },
    ),
    { name: 'cart' },
  ),
);

// Derived values live in selectors, not in state.
export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);
export const selectTotalCents = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
export {};
