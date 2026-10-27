import { useSyncExternalStore } from 'react';

type Listener = () => void;

export function createStore<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    setState(patch: Partial<T> | ((s: T) => Partial<T>)) {
      const next = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      state = next;                       // new reference on every set
      listeners.forEach((l) => l());
    },
    subscribe(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; },
  };
}

export function useStoreSelector<T extends object, S>(
  store: ReturnType<typeof createStore<T>>,
  selector: (s: T) => S,
): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),     // server snapshot: must match client's initial for hydration
  );
}
export {};
