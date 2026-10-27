export {};
interface ListProps<T> {
  items: readonly T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
}
function List<T>(props: ListProps<T>) { /* … */ }

<List
  items={users}                         // users: User[]
  getKey={(u) => u.id}
  renderItem={(u) => <b>{u.name}</b>}
/>
