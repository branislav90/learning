// Todos.tsx
import { useQuery } from '@tanstack/react-query';

type Todo = { id: number; title: string; done: boolean };

async function fetchTodos(signal: AbortSignal): Promise<Todo[]> {
  const res = await fetch('/api/todos', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch does NOT reject on 4xx/5xx
  return res.json();
}

export function Todos() {
  const { data, status, error } = useQuery({
    queryKey: ['todos'],
    queryFn: ({ signal }) => fetchTodos(signal),
  });

  if (status === 'pending') return <p>Loading…</p>;
  if (status === 'error') return <p role="alert">Failed: {error.message}</p>;
  return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}
export {};
