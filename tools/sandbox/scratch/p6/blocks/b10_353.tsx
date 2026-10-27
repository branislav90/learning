// cartStoreContext.tsx
'use client';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { createStore, useStore } from 'zustand';

interface CartState { lines: number[]; add: (id: number) => void }
const makeCartStore = (initial?: Partial<Pick<CartState, 'lines'>>) =>
  createStore<CartState>()((set) => ({
    lines: [],
    ...initial,
    add: (id) => set((s) => ({ lines: [...s.lines, id] })),
  }));

type CartStore = ReturnType<typeof makeCartStore>;
const CartCtx = createContext<CartStore | null>(null);

export function CartProvider({ children, initial }: { children: ReactNode; initial?: { lines: number[] } }) {
  const ref = useRef<CartStore | null>(null);
  if (ref.current === null) ref.current = makeCartStore(initial);   // created once per provider instance
  return <CartCtx.Provider value={ref.current}>{children}</CartCtx.Provider>;
}

export function useCartStore<T>(selector: (s: CartState) => T): T {
  const store = useContext(CartCtx);
  if (!store) throw new Error('useCartStore must be used inside <CartProvider>');
  return useStore(store, selector);
}
export {};
