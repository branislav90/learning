import { memo, useMemo, useState, useTransition, type ChangeEvent } from 'react';

const Results = memo(function Results({ items, query }: { items: readonly string[]; query: string }) {
  const q = query.trim().toLowerCase();
  const visible = useMemo(() => items.filter((s) => s.toLowerCase().includes(q)), [items, q]);
  return <ul aria-label="Results">{visible.map((s) => <li key={s}>{s}</li>)}</ul>;
});

export function FilterableList({ items }: { items: readonly string[] }) {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setText(v);
    startTransition(() => setQuery(v));
  };

  return (
    <div aria-busy={isPending}>
      <label>
        Filter
        <input value={text} onChange={onChange} />
      </label>
      <p role="status" aria-live="polite">{isPending ? 'Updating results' : ''}</p>
      <div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 150ms' }}>
        <Results items={items} query={query} />
      </div>
    </div>
  );
}
