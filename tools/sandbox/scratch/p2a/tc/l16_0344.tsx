import { memo, useDeferredValue, useMemo, useState, useTransition, useEffect } from "react";

const ITEMS: readonly string[] = Array.from({ length: 5000 }, (_, i) => `Item ${i}`);

function burn(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}

const Row = memo(function Row({ label }: { label: string }) {
  burn(0.05);              // 5000 rows × 0.05 ms ≈ 250 ms per full render
  return <li>{label}</li>;
});

const List = memo(function List({ query }: { query: string }) {
  const visible = useMemo(
    () => (query ? ITEMS.filter((s) => s.includes(query)) : ITEMS),
    [query],
  );
  return <ul>{visible.map((s) => <Row key={s} label={s} />)}</ul>;
});

/** A) Deferred value: you own only the input state. */
export function WithDeferredValue() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const stale = query !== deferredQuery;
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter" />
      <div style={{ opacity: stale ? 0.6 : 1 }}>
        <List query={deferredQuery} />
      </div>
    </>
  );
}

/** B) Transition: you own the state setter. */
export function WithTransition() {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <input
        value={query}
        aria-label="Filter"
        onChange={(e) => {
          setQuery(e.target.value);
          startTransition(() => setApplied(e.target.value));
        }}
      />
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <List query={applied} />
      </div>
    </>
  );
}

/** C) Debounce: wait for typing to stop, then render synchronously. */
export function WithDebounce() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(id);               // cleanup: restarts the timer on each keystroke
  }, [query]);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter" />
      <List query={debounced} />
    </>
  );
}
