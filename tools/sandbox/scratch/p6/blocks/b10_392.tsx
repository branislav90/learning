import { subscribeWithSelector } from 'zustand/middleware';
const useStore = create<S>()(subscribeWithSelector((set) => ({ /* ... */ })));

const unsub = useStore.subscribe(
  (s) => s.lines.length,
  (len, prevLen) => analytics.track('cart_size', { len, prevLen }),
);
export {};
