type Theme = 'light' | 'dark' | 'system';
const KEY = 'app:theme:v1';

const themeListeners = new Set<() => void>();

function subscribeTheme(cb: () => void) {
  themeListeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb(); // other tabs wrote it (or storage.clear())
  };
  window.addEventListener('storage', onStorage);
  return () => {
    themeListeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
  } catch {
    return 'system'; // storage blocked (privacy mode, sandboxed iframe)
  }
}

export function setTheme(next: Theme) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore: preference won't persist */
  }
  themeListeners.forEach((l) => l()); // same-tab writes don't fire `storage`
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, readTheme, () => 'system');
}
