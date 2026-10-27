import { memo, useDeferredValue, useMemo, useState } from "react";

interface Item { id: number; label: string }

const Rows = memo(function Rows({ items, query }: { items: readonly Item[]; query: string }) {
  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => (q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items),
    [items, q],
  );
  return (
    <ul>
      {visible.map((i) => (
        <li key={i.id}>{i.label}</li>
      ))}
    </ul>
  );
});

export function FilteredList({ items }: { items: readonly Item[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const stale = deferred !== query;
  return (
    <div>
      <input aria-label="Filter" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: stale ? 0.6 : 1 }}>
        <Rows items={items} query={deferred} />
      </div>
    </div>
  );
}
