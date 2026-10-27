import { useCallback, useState } from 'react';
import type { ZodType } from 'zod';

export function useStoredState<T>(
  key: string,
  schema: ZodType<T>,
  migrate: (raw: unknown) => unknown,
  defaults: T
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const text = window.localStorage.getItem(key);
      if (text === null) return defaults;
      const parsed = schema.safeParse(migrate(JSON.parse(text)));
      return parsed.success ? parsed.data : defaults;
    } catch {
      return defaults;
    }
  });

  const set = useCallback((next: T) => {
    setValue(next);
    try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* best effort */ }
  }, [key]);

  return [value, set];
}
