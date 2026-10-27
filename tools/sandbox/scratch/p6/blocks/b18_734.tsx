interface Codec<T> { parse(raw: string | null): T; format(v: T): string | null } // null => remove param

export function useUrlState<T>(key: string, codec: Codec<T>, opts: { replace?: boolean } = {}) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch); // from §5.1
  const value = useMemo(() => codec.parse(new URLSearchParams(search).get(key)), [search, key, codec]);

  const set = useCallback((v: T) => {
    const sp = new URLSearchParams(window.location.search);
    const raw = codec.format(v);
    if (raw === null) sp.delete(key); else sp.set(key, raw);
    const qs = sp.toString();
    const url = `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`;
    (opts.replace ?? true) ? history.replaceState(null, '', url) : history.pushState(null, '', url);
    notify();
  }, [key, codec, opts.replace]);

  return [value, set] as const;
}
export {};
