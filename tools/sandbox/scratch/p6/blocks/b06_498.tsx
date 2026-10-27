interface Versioned { id: string; version: number }

export function mergeNewer<T extends Versioned>(current: T | undefined, incoming: T): T {
  if (!current) return incoming;
  return incoming.version >= current.version ? incoming : current;   // monotonic reads
}

// Usage inside a cache write, e.g. setQueryData(detailKey, (old) => mergeNewer(old, response))
export {};
