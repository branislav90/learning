// use-controllable-state.ts
import { useCallback, useEffect, useRef, useState } from "react";

type Options<T> = {
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
  /** Used in warnings. */
  name?: string;
};

export function useControllableState<T>({ value, defaultValue, onChange, name = "Component" }: Options<T>) {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // Development-only mode-switch warning. Runs after commit; reads/writes the ref outside render.
  const wasControlled = useRef(isControlled);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && wasControlled.current !== isControlled) {
      console.warn(
        `${name} changed from ${wasControlled.current ? "controlled" : "uncontrolled"} to ` +
          `${isControlled ? "controlled" : "uncontrolled"}. Decide on one mode for the component's lifetime.`,
      );
    }
    wasControlled.current = isControlled;
  }, [isControlled, name]);

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);   // never write internal state when controlled
      onChange?.(next);                        // always notify
    },
    [isControlled, onChange],
  );

  return [current, setValue] as const;
}
export {};
