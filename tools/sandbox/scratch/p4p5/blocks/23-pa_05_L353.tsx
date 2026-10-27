// Before
const Row = React.memo(function Row({ item, onSelect }: RowProps) { /* … */ });
function List({ items }: { items: Item[] }) {
  const onSelect = useCallback((id: string) => select(id), []);
  const sorted = useMemo(() => [...items].sort(byName), [items]);
  return sorted.map((i) => <Row key={i.id} item={i} onSelect={onSelect} />);
}
export {};
