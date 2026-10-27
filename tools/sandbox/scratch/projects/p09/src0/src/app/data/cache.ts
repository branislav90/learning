// src/app/data/cache.ts
export type Fetcher<T> = () => Promise<T>;

export interface DataCache {
  read<T>(key: string, fetcher: Fetcher<T>): Promise<T>;
}

type Tracked<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: unknown;
};

function track<T>(p: Promise<T>): Tracked<T> {
  const t = p as Tracked<T>;
  t.status = 'pending';
  t.then(
    (v) => { t.status = 'fulfilled'; t.value = v; },
    (e) => { t.status = 'rejected'; t.reason = e; },
  );
  return t;
}

/** Fulfilled-at-creation promise used for data that arrived with the HTML. */
export function fulfilled<T>(value: T): Tracked<T> {
  const p = Promise.resolve(value) as Tracked<T>;
  p.status = 'fulfilled'; // ⚠ React's `use` reads `status`/`value` as an optimization; not documented API.
  p.value = value;
  return p;
}

export function createMapCache(
  onResolve?: (key: string, value: unknown) => void,
): DataCache & { entries: Map<string, Tracked<unknown>> } {
  const entries = new Map<string, Tracked<unknown>>();
  return {
    entries,
    read<T>(key: string, fetcher: Fetcher<T>): Promise<T> {
      let hit = entries.get(key) as Tracked<T> | undefined;
      if (!hit) {
        hit = track(fetcher());
        // Register BEFORE React attaches its own listener (it attaches when `use` suspends),
        // so our data <script> is written before React flushes the boundary content.
        if (onResolve) hit.then((v) => onResolve(key, v), () => {});
        entries.set(key, hit);
      }
      return hit;
    },
  };
}
