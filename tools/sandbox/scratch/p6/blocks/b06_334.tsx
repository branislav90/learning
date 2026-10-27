// mini-cache.ts
export type Key = readonly unknown[];
const hash = (k: Key) => JSON.stringify(k);      // ⚠ object key order is not normalized; real libs use a stable hash
const matchesPrefix = (prefix: Key, key: Key) =>
  prefix.length <= key.length && prefix.every((p, i) => JSON.stringify(p) === JSON.stringify(key[i]));

export interface Entry<T = unknown> {
  readonly key: Key;
  readonly data: T | undefined;
  readonly error: Error | undefined;
  readonly updatedAt: number | undefined;
  readonly invalid: boolean;
  readonly inflight: boolean;
}

interface Flight { controller: AbortController; promise: Promise<void> }

export class MiniCache {
  private entries = new Map<string, Entry>();
  private flights = new Map<string, Flight>();
  private listeners = new Set<() => void>();

  subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  get = <T,>(key: Key) => this.entries.get(hash(key)) as Entry<T> | undefined;

  private patch(key: Key, p: Partial<Omit<Entry, 'key'>>) {
    const h = hash(key);
    const prev: Entry = this.entries.get(h) ?? {
      key, data: undefined, error: undefined, updatedAt: undefined, invalid: false, inflight: false,
    };
    this.entries.set(h, { ...prev, ...p });      // new object only when we write ⇒ stable snapshots for useSyncExternalStore
    this.listeners.forEach((l) => l());
  }

  fetch<T>(key: Key, fn: (signal: AbortSignal) => Promise<T>): Promise<void> {
    const h = hash(key);
    const existing = this.flights.get(h);
    if (existing) return existing.promise;                           // dedupe

    const controller = new AbortController();
    this.patch(key, { inflight: true });
    const promise = fn(controller.signal)
      .then(
        (data) => {
          if (controller.signal.aborted) return;                     // discarded: invalidated while in flight
          this.patch(key, { data, error: undefined, updatedAt: Date.now(), invalid: false, inflight: false });
        },
        (err: unknown) => {
          if (controller.signal.aborted) return;
          this.patch(key, { error: err instanceof Error ? err : new Error(String(err)), inflight: false });
        },
      )
      .finally(() => {
        if (this.flights.get(h)?.controller === controller) this.flights.delete(h);
      });
    this.flights.set(h, { controller, promise });
    return promise;
  }

  /** Write-through: replace data and mark fresh. Cancels an in-flight read that could overwrite it. */
  set<T>(key: Key, data: T) {
    this.cancel(key);
    this.patch(key, { data, error: undefined, updatedAt: Date.now(), invalid: false, inflight: false });
  }

  /** Mark matching entries invalid and cancel their in-flight reads; active observers will refetch. */
  invalidate(prefix: Key) {
    for (const e of [...this.entries.values()]) {
      if (matchesPrefix(prefix, e.key)) {
        this.cancel(e.key);
        this.patch(e.key, { invalid: true, inflight: false });
      }
    }
  }

  private cancel(key: Key) {
    const h = hash(key);
    const f = this.flights.get(h);
    if (f) { f.controller.abort(); this.flights.delete(h); }
  }

  clear() { this.flights.forEach((f) => f.controller.abort()); this.flights.clear(); this.entries.clear(); this.listeners.forEach((l) => l()); }
}
export {};
