export {};
function SearchPage() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Suspense fallback={<Skeleton />}>
        <Results query={deferred} /> {/* uses a Suspense-enabled data source, e.g. use(cachedPromise(deferred)) */}
      </Suspense>
    </>
  );
}
