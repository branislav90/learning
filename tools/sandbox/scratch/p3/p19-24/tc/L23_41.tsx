export {};
function UserName({ id }: { id: string }) {
  const [state, setState] = useState<
    { status: 'loading' } | { status: 'error' } | { status: 'ok'; name: string }
  >({ status: 'loading' });

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' }); // allowed: synchronization start; alternatively key the component by id
    fetch(`/api/users/${id}`, { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<{ name: string }>;
      })
      .then((u) => setState({ status: 'ok', name: u.name }))
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setState({ status: 'error' });
      });
    return () => ac.abort();
  }, [id]);

  if (state.status === 'loading') return <span>…</span>;
  if (state.status === 'error') return <span role="alert">Failed to load</span>;
  return <span>{state.name}</span>;
}
