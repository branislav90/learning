import { useDeferredValue, useEffect, useState } from "react";

export function useDebouncedTransitionValue<T>(value: T, ms: number): [T, boolean] {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  const deferred = useDeferredValue(debounced);
  return [deferred, debounced !== deferred || value !== debounced];
}
