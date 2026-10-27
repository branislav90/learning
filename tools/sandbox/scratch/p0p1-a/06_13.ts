export function memoize1<A, R>(fn: (a: A) => R, maxSize = Infinity): (a: A) => R {
  const cache = new Map<A, R>();
  return (a) => {
    if (cache.has(a)) return cache.get(a) as R;
    const r = fn(a);
    cache.set(a, r);
    if (cache.size > maxSize) {
      const oldest = cache.keys().next().value as A;   // Map iterates in insertion order
      cache.delete(oldest);
    }
    return r;
  };
}
