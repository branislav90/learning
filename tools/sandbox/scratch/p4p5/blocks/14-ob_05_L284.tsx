import { useSyncExternalStore } from 'react';
import { createStore, type Store } from './store';

export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),        // server snapshot: same source for a client-only store
  );
}

type Cart = { items: readonly { sku: string; price: number; qty: number }[]; lastViewedAt: number };
export const cartStore = createStore<Cart>({ items: [], lastViewedAt: 0 });

export function CartBadge() {
  const count = useStore(cartStore, (c) => c.items.reduce((n, i) => n + i.qty, 0)); // primitive: safe
  return <span aria-label="Items in cart">{count}</span>;
}
export {};
