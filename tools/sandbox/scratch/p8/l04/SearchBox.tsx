// SearchBox.tsx
import { useEffect, useState } from "react";

export interface Hit { id: string; title: string }

export function SearchBox({ search, debounceMs = 300 }: {
  search: (q: string, signal: AbortSignal) => Promise<Hit[]>;
  debounceMs?: number;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    if (!query.trim()) { setHits([]); return; }
    const controller = new AbortController();
    const id = setTimeout(() => {
      search(query, controller.signal)
        .then((h) => { if (!controller.signal.aborted) setHits(h); })
        .catch(() => { /* aborted or failed: keep previous hits */ });
    }, debounceMs);
    return () => { clearTimeout(id); controller.abort(); };
  }, [query, search, debounceMs]);

  return (
    <div>
      <label htmlFor="q">Search</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul aria-label="Results">
        {hits.map((h) => <li key={h.id}>{h.title}</li>)}
      </ul>
    </div>
  );
}
