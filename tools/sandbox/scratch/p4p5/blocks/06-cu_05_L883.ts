function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
export function useLocalStorageString(key: string, fallback: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) ?? fallback,
    () => fallback,                              // SSR snapshot
  );
  const set = useCallback((next: string) => {
    localStorage.setItem(key, next);
    window.dispatchEvent(new StorageEvent("storage", { key }));   // same-tab notification
  }, [key]);
  return [value, set] as const;
}
export {};
