type User = { id: string; name: string; email: string; active: boolean };

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/users", { signal: ctrl.signal })
      .then((r) => r.json())
      .then(setUsers)
      .catch((e) => { if (e.name !== "AbortError") setError(String(e)); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const shown = users.filter(
    (u) => u.active && u.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">{error}</p>;
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {shown.map((u) => (
          <li key={u.id}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
}
export {};
