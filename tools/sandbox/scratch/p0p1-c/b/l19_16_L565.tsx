export {};
import { useCallback, useState, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initial;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : initial;      // untrusted data validated before use
    } catch {
      return initial;                                  // malformed JSON or storage unavailable
    }
  });

  const set: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      setState((prev) => {
        const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota or blocked */ }
        return value;
      });
    },
    [key],
  );
  return [state, set];
}
