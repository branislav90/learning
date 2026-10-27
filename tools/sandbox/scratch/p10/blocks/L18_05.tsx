import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';

type FlagValues = Record<string, boolean>;
declare global { interface Window { __FLAGS__?: FlagValues } }

class FlagStore {
  private values: FlagValues;
  private listeners = new Set<() => void>();
  private frozenKeys = new Set<string>();     // keys already read during this session: freeze to avoid remount flapping
  constructor(initial: FlagValues) { this.values = initial; }
  get = (key: string): boolean => { this.frozenKeys.add(key); return this.values[key] ?? false; };
  subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  update(next: FlagValues) {
    // apply updates only to keys not yet consumed; consumed keys take effect next session
    const merged = { ...this.values };
    for (const k of Object.keys(next)) if (!this.frozenKeys.has(k)) merged[k] = next[k];
    this.values = merged;
    this.listeners.forEach((l) => l());
  }
}

const StoreCtx = createContext<FlagStore | null>(null);

export function FlagProvider({ children, pollUrl }: { children: ReactNode; pollUrl: string }) {
  const store = useRef<FlagStore | null>(null);
  store.current ??= new FlagStore(window.__FLAGS__ ?? {});
  useEffect(() => {
    const id = window.setInterval(async () => {
      try { store.current!.update(await (await fetch(pollUrl)).json()); } catch { /* keep current values */ }
    }, 60_000);
    return () => window.clearInterval(id);
  }, [pollUrl]);
  return <StoreCtx value={store.current}>{children}</StoreCtx>;   // ⚠ React 19 syntax; use .Provider on 18
}

export function useFlag(key: string): boolean {
  const store = useContext(StoreCtx);
  if (!store) throw new Error('useFlag outside <FlagProvider>');
  return useSyncExternalStore(store.subscribe, () => store.get(key), () => store.get(key));
}
