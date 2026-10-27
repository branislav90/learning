import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener('popstate', l);
  return () => {
    listeners.delete(l);
    window.removeEventListener('popstate', l);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => '';

export function useSearchParam(name: string, fallback: string) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const value = new URLSearchParams(search).get(name) ?? fallback;

  const setValue = useCallback(
    (next: string, { replace = true } = {}) => {
      const sp = new URLSearchParams(window.location.search);
      if (next === fallback) sp.delete(name); else sp.set(name, next); // omit defaults
      const qs = sp.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
      if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url);
      notify(); // pushState/replaceState emit no event
    },
    [name, fallback],
  );

  return [value, setValue] as const;
}
export {};
