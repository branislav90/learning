// A search page: the input is React state (urgent), the heavy filtered list reads deferred input.
function Search() {
  const [query, setQuery] = useState('');            // React state: transitions apply
  const deferred = useDeferredValue(query);          // lags behind during heavy renders
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsList query={deferred} />
    </>
  );
}
export {};
