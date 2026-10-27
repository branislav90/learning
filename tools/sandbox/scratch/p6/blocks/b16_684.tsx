import { useEffect, useRef, useState } from 'react';

export function useDraft<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* quota/blocked: ignore */ }
    }, 500);
    return () => window.clearTimeout(timer.current);
  }, [key, value]);

  const clear = () => { try { sessionStorage.removeItem(key); } catch {} setValue(initial); };
  return [value, setValue, clear] as const;
}
export {};
