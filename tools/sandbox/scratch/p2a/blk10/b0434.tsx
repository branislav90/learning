import { memo, useDeferredValue, useEffect, useState } from "react";

function burn(ms: number): void {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}

const Results = memo(function Results({ q }: { q: string }) {
  console.log("render Results", JSON.stringify(q));  // render phase: may run for drafts
  burn(120);                                          // demo only
  useEffect(() => {
    console.log("commit  Results", JSON.stringify(q)); // after commit only
  }, [q]);
  return <p>Results for {q}</p>;
});

export function App() {
  const [q, setQ] = useState("");
  const deferred = useDeferredValue(q);
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="q" />
      <Results q={deferred} />
    </>
  );
}
