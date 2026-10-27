import { useSyncExternalStore } from "react";

export function createStoreHook<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
  const getState = () => state;

  function set(next: T | ((prev: T) => T)) {
    const value = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    if (Object.is(value, state)) return;
    state = value;
    listeners.forEach((l) => l());
  }

  function useStore<S>(selector: (s: T) => S): S {
    return useSyncExternalStore(subscribe, () => selector(state), () => selector(initial));
  }
  return { useStore, set };
}
export {};
