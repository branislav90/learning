// keyed-cache.ts
export interface KeyedCache<K, V> {
  get(key: K): Promise<V>;
  preload(key: K): void;
  invalidate(key?: K): void;
}

export function createKeyedCache<K extends string | number, V>(
  loader: (key: K) => Promise<V>,
): KeyedCache<K, V> {
  const map = new Map<K, Promise<V>>();
  return {
    get(key) {
      let p = map.get(key);
      if (!p) {
        p = loader(key);
        p.catch(() => {});          // mark handled; consumers still see the rejection via use()
        map.set(key, p);
      }
      return p;
    },
    preload(key) { void this.get(key); },
    invalidate(key) { if (key === undefined) map.clear(); else map.delete(key); },
  };
}
