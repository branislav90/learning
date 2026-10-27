useEffect(() => {
  if (query.trim() === '') { setState({ status: 'idle' }); return; }
  const controller = new AbortController();
  const t = setTimeout(() => {
    setState({ status: 'loading', query });
    fetchJson(url(query), controller.signal)
      .then(parseProducts)
      .then((results) => { if (!controller.signal.aborted) setState({ status: 'success', query, results }); })
      .catch((e) => { if (!controller.signal.aborted) setState({ status: 'error', query, error: toError(e) }); });
  }, 300);
  return () => { clearTimeout(t); controller.abort(); };
}, [query]);
export {};
