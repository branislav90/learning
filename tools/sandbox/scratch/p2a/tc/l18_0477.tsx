import { useEffect, useRef } from "react";

export function useEvent<A extends unknown[], R>(handler: (...args: A) => R): (...args: A) => R {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;               // update AFTER commit: never write refs during render
  });
  return useRef((...args: A) => ref.current(...args)).current; // stable identity
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (e: WindowEventMap[K]) => void,
): void {
  const stable = useEvent(listener);
  useEffect(() => {
    window.addEventListener(type, stable);
    return () => window.removeEventListener(type, stable);
  }, [type, stable]);                    // `stable` never changes → resubscribes only when `type` changes
}
