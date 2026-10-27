import { useSyncExternalStore } from 'react';

const sameTab = new Set<() => void>();

function subscribe(cb: () => void) {
  sameTab.add(cb);
  window.addEventListener('storage', cb);        // cross-tab
  return () => { sameTab.delete(cb); window.removeEventListener('storage', cb); };
}

export function setLocalValue(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
  } catch { /* ignore quota/privacy errors */ }
  sameTab.forEach((cb) => cb());                  // same-tab notification
}

export function useLocalStorageValue(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => { try { return localStorage.getItem(key); } catch { return null; } },  // string|null: stable by value
    () => null,
  );
}
export {};
