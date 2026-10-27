import { useEffect, useState } from 'react';

export function SearchBox() {
  const { search, setFilter } = useProductSearch();
  const [text, setText] = useState(search.q);

  // Adopt external URL changes (Back/Forward, links) into the input
  useEffect(() => { setText(search.q); }, [search.q]);

  // Commit to URL after the user pauses typing
  useEffect(() => {
    if (text === search.q) return;
    const id = setTimeout(() => setFilter({ q: text }), 300);
    return () => clearTimeout(id);
  }, [text, search.q, setFilter]);

  return <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Search products" />;
}
export {};
