// 1. Headless core: behavior only, no markup
export function useTable<T>(opts: {
  rows: readonly T[];
  getRowId: (row: T) => string;
  selection?: { value?: ReadonlySet<string>; defaultValue?: ReadonlySet<string>; onChange?: (s: ReadonlySet<string>) => void };
}) {
  const [selected, setSelected] = useControllableState<ReadonlySet<string>>({
    value: opts.selection?.value,
    defaultValue: opts.selection?.defaultValue ?? new Set(),
    onChange: opts.selection?.onChange,
  });
  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  return { rows: opts.rows, selected, toggle, isSelected: (id: string) => selected.has(id), getRowId: opts.getRowId };
}

// 2. Consumer composes markup; library provides optional styled parts built on the core
function Orders({ orders }: { orders: Order[] }) {
  const table = useTable({ rows: orders, getRowId: (o) => o.id });
  return (
    <table>
      <tbody>
        {table.rows.map((o) => (
          <tr key={table.getRowId(o)} data-selected={table.isSelected(o.id) || undefined}>
            <td><input type="checkbox" checked={table.isSelected(o.id)} onChange={() => table.toggle(o.id)} aria-label={`Select order ${o.id}`} /></td>
            <td><a href={`/orders/${o.id}`}>{o.number}</a></td>   {/* real link: SEO, middle-click */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export {};
