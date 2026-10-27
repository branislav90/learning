import type { ReactNode } from "react";

type Row<T> = { id: string; value: T };

type ListProps<T> = {
  rows: Row<T>[];
  selectedId: string | null;
  renderRow: (row: Row<T>, state: { selected: boolean; index: number }) => ReactNode;
  renderEmpty?: () => ReactNode;
};

export function List<T>({ rows, selectedId, renderRow, renderEmpty }: ListProps<T>) {
  if (rows.length === 0) return <>{renderEmpty?.() ?? <p>No items.</p>}</>;
  return (
    <ul role="listbox">
      {rows.map((row, index) => (
        <li
          key={row.id}
          role="option"
          aria-selected={row.id === selectedId}
        >
          {renderRow(row, { selected: row.id === selectedId, index })}
        </li>
      ))}
    </ul>
  );
}
export {};
