import { useSyncExternalStore } from 'react';

const URL_CHANGE_EVENT = 'app:urlchange';

function subscribeToUrl(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(URL_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(URL_CHANGE_EVENT, onChange);
  };
}

export function setSearchParam(
  key: string,
  value: string | null,
  mode: 'push' | 'replace' = 'push',
) {
  const url = new URL(window.location.href);
  if (value === null || value === '') url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
  // pushState/replaceState do NOT fire popstate, so notify subscribers ourselves.
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

export function useSearchParam(key: string): string | null {
  return useSyncExternalStore(
    subscribeToUrl,
    () => new URLSearchParams(window.location.search).get(key), // snapshot: a primitive
    () => null, // server snapshot
  );
}
