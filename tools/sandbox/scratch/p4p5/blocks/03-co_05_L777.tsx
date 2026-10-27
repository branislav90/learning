function useSort<T>(rows: readonly T[], compare: ((a: T, b: T) => number) | null) {
  return compare ? [...rows].sort(compare) : rows;
}

function UsersTable({ users }: { users: readonly User[] }) {
  const { query, setQuery, results } = useSearch(users, userMatches);
  const [dir, setDir] = useState<"asc" | "desc" | null>(null);
  const sorted = useSort(results, dir && ((a, b) => (dir === "asc" ? 1 : -1) * a.name.localeCompare(b.name)));
  const paged = usePaged(sorted, 20);
  /* render input, sort toggle, <Table rows={paged.slice} …/>, <Pager …/> */
}
export {};
