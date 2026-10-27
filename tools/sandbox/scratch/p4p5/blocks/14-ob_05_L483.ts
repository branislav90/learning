export function subscribeCrossTab(key: string, onValue: (v: string | null) => void) {
  const handler = (e: StorageEvent) => {
    if (e.storageArea === localStorage && e.key === key) onValue(e.newValue);
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
export {};
