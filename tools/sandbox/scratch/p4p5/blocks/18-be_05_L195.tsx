// use-controllable-state.ts
import { useCallback, useEffect, useRef, useState } from 'react';

type Options<T> = {
  value?: T;                         // controlled value (undefined => uncontrolled)
  defaultValue: T;                   // initial value if uncontrolled
  onChange?: (next: T) => void;
};

export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  // dev-only: warn on mode switch
  const wasControlled = useRef(isControlled);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && wasControlled.current !== isControlled) {
      console.warn('A component changed from ' + (wasControlled.current ? 'controlled to uncontrolled' : 'uncontrolled to controlled') + '. Decide once.');
    }
    wasControlled.current = isControlled;
  }, [isControlled]);

  // Latest-value refs keep `set` stable (Lesson 14, 5.2)
  const currentRef = useRef(current);
  const onChangeRef = useRef(onChange);
  const controlledRef = useRef(isControlled);
  useEffect(() => { currentRef.current = current; onChangeRef.current = onChange; controlledRef.current = isControlled; });

  const set = useCallback((next: T) => {
    if (Object.is(next, currentRef.current)) return;
    if (!controlledRef.current) setInternal(next);
    onChangeRef.current?.(next);
  }, []);

  return [current, set] as const;
}
export {};
