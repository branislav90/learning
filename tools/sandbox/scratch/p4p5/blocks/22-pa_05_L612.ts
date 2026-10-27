import type { Ref, RefCallback } from 'react';

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === 'function') {
        const result = ref(node) as void | (() => void);
        if (typeof result === 'function') cleanups.push(result);
        else cleanups.push(() => ref(null));
      } else if (ref) {
        (ref as { current: T | null }).current = node;
        cleanups.push(() => { (ref as { current: T | null }).current = null; });
      }
    }
    return () => cleanups.forEach((fn) => fn());
  };
}
export {};
