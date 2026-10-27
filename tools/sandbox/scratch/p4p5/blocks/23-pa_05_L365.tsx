function Row({ item, onSelect }: RowProps) { /* … */ }          // memo deleted
function List({ items }: { items: Item[] }) {
  const sorted = [...items].sort(byName);                        // sorts on every render
  return sorted.map((i) => <Row key={i.id} item={i} onSelect={(id) => select(id)} />);
}
export {};
