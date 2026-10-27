export function createPersistedStore<T>(key: string, initial: T) {
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();
  const read = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try { const raw = localStorage.getItem(key); if (raw != null) state = JSON.parse(raw) as T; } catch { /* ignore */ }
  };
  return {
    getSnapshot: () => { read(); return state; },
    getServerSnapshot: () => initial,
    subscribe(l: () => void) {
      listeners.add(l);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        try { state = e.newValue == null ? initial : (JSON.parse(e.newValue) as T); } catch { return; }
        listeners.forEach((x) => x());
      };
      window.addEventListener("storage", onStorage);
      return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
    },
    set(next: T) {
      state = next;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* quota/private mode */ }
      listeners.forEach((l) => l());
    },
  };
}
export {};
