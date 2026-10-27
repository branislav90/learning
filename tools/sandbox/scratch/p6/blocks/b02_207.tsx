useEffect(() => {
  let ignore = false;                       // generation-scoped token
  fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then((r) => r.json())
    .then((data: Product[]) => {
      if (!ignore) setResults(data);
    });
  return () => { ignore = true; };          // cleanup ends this generation
}, [query]);
export {};
