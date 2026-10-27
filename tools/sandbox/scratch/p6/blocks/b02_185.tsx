import { useEffect, useState } from 'react';

interface Product { id: string; name: string }

export function SearchBad({ query }: { query: string }) {
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data: Product[]) => setResults(data));   // writes whichever resolves last
  }, [query]);

  return <ul>{results.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
export {};
