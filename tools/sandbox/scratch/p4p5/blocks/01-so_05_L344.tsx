// users/UserList.tsx — composition + the one piece of UI state
export function UserList() {
  const state = useUsers();
  const [query, setQuery] = useState("");

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error") return <p role="alert">{state.message}</p>;
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search users" />
      <UserListView users={visibleUsers(state.users, query)} />
    </div>
  );
}
export {};
