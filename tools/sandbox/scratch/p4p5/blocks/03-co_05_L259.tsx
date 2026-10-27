import { useState, type ReactNode } from "react";

// 1. Behaviour as a hook: stateful search over any list
function useSearch<T>(items: readonly T[], matches: (item: T, q: string) => boolean) {
  const [query, setQuery] = useState("");
  const results = items.filter((i) => matches(i, query));
  return { query, setQuery, results } as const;
}

// 2. Structure as a component: a presentational list that renders what it is told
function List<T>({ items, getKey, renderItem }: {
  items: readonly T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// 3. Specialisation by composition
type User = { id: string; name: string };
const userMatches = (u: User, q: string) => u.name.toLowerCase().includes(q.toLowerCase());

function UserList({ users }: { users: readonly User[] }) {
  const { query, setQuery, results } = useSearch(users, userMatches);
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search users" />
      <List items={results} getKey={(u) => u.id} renderItem={(u) => <b>{u.name}</b>} />
    </div>
  );
}
export {};
