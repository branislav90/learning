function useFetchJson<T>(url: string) {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });
  useEffect(() => {
    const ctrl = new AbortController();
    setState({ loading: true });
    fetch(url, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<T>; })
      .then((data) => setState({ data, loading: false }))
      .catch((e: unknown) => { if ((e as Error).name !== "AbortError") setState({ error: e as Error, loading: false }); });
    return () => ctrl.abort();
  }, [url]);
  return state;
}
export {};
