function Search() {
  const [q, setQ] = useState('');
  const deferredQ = useDeferredValue(q);
  const stale = q !== deferredQ;
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
      <div style={{ opacity: stale ? 0.5 : 1 }}>
        <Suspense fallback={<ResultsSkeleton />}>
          <Results query={deferredQ} />   {/* useSuspenseQuery inside, key includes query */}
        </Suspense>
      </div>
    </>
  );
}
export {};
