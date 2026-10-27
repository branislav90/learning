type VirtualListProps<T> = {
  items: readonly T[];
  rowHeight: number;
  height: number;
  renderRow: (item: T, index: number, style: React.CSSProperties) => ReactNode;
};

export function VirtualList<T>({ items, rowHeight, height, renderRow }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const end = Math.min(items.length, Math.ceil((scrollTop + height) / rowHeight) + 2);

  const rows: ReactNode[] = [];
  for (let i = start; i < end; i++) {
    rows.push(
      <div key={i} style={{ position: "absolute", top: i * rowHeight, height: rowHeight, left: 0, right: 0 }}>
        {renderRow(items[i], i, { height: rowHeight })}
      </div>,
    );
  }

  return (
    <div style={{ height, overflow: "auto", position: "relative" }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * rowHeight }}>{rows}</div>
    </div>
  );
}
export {};
