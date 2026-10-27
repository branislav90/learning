export {};
const deferred = useDeferredValue(query);
return <Results query={deferred} onSelect={(id) => setSelected(id)} />; // Results is memo'd
