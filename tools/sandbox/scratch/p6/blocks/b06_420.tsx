// use-cached.ts
import { useEffect, useRef, useSyncExternalStore } from 'react';

export function useCached<T>(
  cache: MiniCache,
  key: Key,
  fn: (signal: AbortSignal) => Promise<T>,
  staleMs = 30_000,
) {
  const h = hash(key);
  const entry = useSyncExternalStore(
    cache.subscribe,
    () => cache.get<T>(key),      // returns the same object until a patch occurs
  );

  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });

  useEffect(() => {
    const e = cache.get<T>(key);
    const stale = e === undefined || e.updatedAt === undefined || e.invalid || Date.now() - e.updatedAt > staleMs;
    if (stale && !e?.inflight) void cache.fetch(key, (s) => fnRef.current(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key is represented by its hash
  }, [cache, h, staleMs, entry?.invalid, entry?.inflight]);

  return entry;
}
export {};
