// packages/platform/src/url/use-search-state.ts
import { useSearchParams } from 'react-router';
import { useCallback, useMemo } from 'react';
import type { ZodType } from 'zod';

export function useSearchState<T extends Record<string, unknown>>(schema: ZodType<T>, defaults: T) {
  const [params, setParams] = useSearchParams();
  const value = useMemo(() => {
    const raw = Object.fromEntries(params.entries());
    const parsed = schema.safeParse({ ...defaults, ...raw });
    return parsed.success ? parsed.data : defaults;           // invalid URL never crashes the page
  }, [params, schema, defaults]);
  const set = useCallback((patch: Partial<T>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(patch)) (v === undefined || v === '' ? next.delete(k) : next.set(k, String(v)));
      return next;
    }, { replace: true });                                     // filters shouldn't spam history
  }, [setParams]);
  return [value, set] as const;
}
