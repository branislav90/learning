// store.ts
export type Listener = () => void;
export type Store<T> = {
  getState: () => T;
  setState: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: Listener) => () => void;
};

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,

    setState(next) {
      const value = typeof next === 'function' ? (next as (prev: T) => T)(state) : next;
      if (Object.is(value, state)) return;            // no change, no notification
      state = value;
      for (const l of [...listeners]) l();            // copy: deterministic under (un)subscribe during notify
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };   // idempotent: deleting twice is harmless
    },
  };
}
export {};
