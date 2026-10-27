export {};
// ✅
useEffect(() => {
  const ac = new AbortController();
  fetch(`/api/user/${id}`, { signal: ac.signal })
    .then((r) => r.json())
    .then(setUser)
    .catch((e) => { if (e.name !== 'AbortError') setError(e); });
  return () => ac.abort();
}, [id]);
