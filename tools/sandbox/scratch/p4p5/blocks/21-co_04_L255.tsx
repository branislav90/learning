// src/internal/useControllableState.ts
import { useCallback, useRef, useState } from "react";

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
}): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const wasControlled = useRef(isControlled);

  if (process.env.NODE_ENV !== "production" && wasControlled.current !== isControlled) {
    console.error(
      "A component changed between controlled and uncontrolled. Decide for the component's lifetime."
    );
  }

  const current = isControlled ? value : internal;

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [current as T, set] as const;
}
export {};
