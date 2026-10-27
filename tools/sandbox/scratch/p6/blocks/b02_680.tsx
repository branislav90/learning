const inFlight = new Map<string, Promise<unknown>>();
export function singleFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const p = fn().finally(() => { if (inFlight.get(key) === p) inFlight.delete(key); });
  inFlight.set(key, p);
  return p;
}
export {};
