declare const S: any; type S<T=any,U=any,V=any> = any;
declare const analytics: any; type analytics<T=any,U=any,V=any> = any;
declare const create: any; type create<T=any,U=any,V=any> = any;
import { subscribeWithSelector } from 'zustand/middleware';
const useStore = create<S>()(subscribeWithSelector((set) => ({ /* ... */ })));

const unsub = useStore.subscribe(
  (s) => s.lines.length,
  (len, prevLen) => analytics.track('cart_size', { len, prevLen }),
);
export {};
