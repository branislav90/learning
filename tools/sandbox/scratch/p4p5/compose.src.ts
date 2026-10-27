// compose.ts
import type { Ref, RefCallback, RefObject, SyntheticEvent } from 'react';

export function composeHandlers<E extends SyntheticEvent>(
  user: ((e: E) => void) | undefined,
  ours: (e: E) => void,
) {
  return (e: E) => {
    user?.(e);
    if (!e.defaultPrevented) ours(e);     // consumer may veto with preventDefault()
  };
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups: Array<(() => void) | undefined> = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node) as unknown;            // React 19: may return a cleanup function
        return typeof cleanup === 'function' ? (cleanup as () => void) : () => ref(null);
      }
      if (ref) { (ref as RefObject<T | null>).current = node; return () => { (ref as RefObject<T | null>).current = null; }; }
      return undefined;
    });
    return () => cleanups.forEach((c) => c?.());
  };
}
export {};
