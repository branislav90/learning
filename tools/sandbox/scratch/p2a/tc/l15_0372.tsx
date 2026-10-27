import { memo, useMemo, useState, useTransition } from "react";

function burn(ms: number): void {
  const end = performance.now() + ms;
  while (performance.now() < end) { /* simulate expensive render work */ }
}

const SlowRow = memo(function SlowRow({ text }: { text: string }) {
  burn(1);                       // ≈1 ms per row; each SlowRow is its own fiber => a yield point
  return <li>{text}</li>;
});

const Results = memo(function Results({ query }: { query: string }) {
  const rows = useMemo(
    () => Array.from({ length: 300 }, (_, i) => `${query} · result ${i}`),
    [query],
  );
  return (
    <ul>
      {rows.map((r) => (
        <SlowRow key={r} text={r} />
      ))}
    </ul>
  );
});

export default function Search() {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <label>
        Search
        <input
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);                           // urgent: keep the input responsive
            startTransition(() => setShown(v));    // non-urgent: results may lag, may be abandoned
          }}
        />
      </label>
      {isPending && <span role="status">Updating…</span>}
      <Results query={shown} />
    </>
  );
}
