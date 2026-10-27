import { useCallback, useEffect, useRef, useState } from 'react';

type Options<T> = {
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
};

export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState<T>(defaultValue);
  const current = isControlled ? (value as T) : inner;

  // Dev-time warning: mode must not change for the lifetime of an instance.
  const wasControlled = useRef(isControlled);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && wasControlled.current !== isControlled) {
      console.warn(
        `A component changed from ${wasControlled.current ? 'controlled' : 'uncontrolled'} to ` +
        `${isControlled ? 'controlled' : 'uncontrolled'}. Decide for the lifetime of the component.`,
      );
    }
  }, [isControlled]);

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
      if (!Object.is(next, current)) onChange?.(next);
    },
    [isControlled, current, onChange],
  );

  return [current, set] as const;
}
export {};
