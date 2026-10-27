// useStore.ts
import { useSyncExternalStore } from 'react';
import type { Store } from './store';

export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()), // see SSR note below
  );
}
