// model/useSelection.ts — behaviour only; no markup
export function useSelection<T>(items: readonly T[], getId: (t: T) => string) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const toggle = (item: T) =>
    setSelected((prev) => {
      const next = new Set(prev);
      const id = getId(item);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const isSelected = (item: T) => selected.has(getId(item));
  const clear = () => setSelected(new Set());
  return { selected, toggle, isSelected, clear, count: selected.size, all: items.length };
}

// Two completely different views, one behaviour
function TableView({ rows }: { rows: Row[] }) {
  const sel = useSelection(rows, (r) => r.id);
  return <table>{/* checkboxes call sel.toggle(row) */}</table>;
}
function GridView({ rows }: { rows: Row[] }) {
  const sel = useSelection(rows, (r) => r.id);
  return <div className="grid">{/* cards call sel.toggle(row) */}</div>;
}
export {};
