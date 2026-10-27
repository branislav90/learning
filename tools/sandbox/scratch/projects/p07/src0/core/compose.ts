// core/compose.ts
import type { Ref, RefCallback } from 'react'

/** Run the consumer's handler first; skip ours if they called preventDefault. */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirs: ((e: E) => void) | undefined,
  ours: ((e: E) => void) | undefined,
) {
  return (e: E) => {
    theirs?.(e)
    if (!e.defaultPrevented) ours?.(e)
  }
}

/** Merge refs. React 19: callback refs may return a cleanup function. */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups: Array<() => void> = []
    for (const ref of refs) {
      if (typeof ref === 'function') {
        const cleanup = ref(node)
        if (typeof cleanup === 'function') cleanups.push(cleanup)
        else cleanups.push(() => ref(null))
      } else if (ref) {
        ;(ref as { current: T | null }).current = node
        cleanups.push(() => { (ref as { current: T | null }).current = null })
      }
    }
    return () => cleanups.forEach((c) => c())
  }
}
