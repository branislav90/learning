// shared/ui/DataList.tsx
import type { Key, ReactNode } from "react";

interface DataListProps<T> {
  items: readonly T[];
  getKey: (item: T) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  empty?: ReactNode;
  header?: ReactNode;
}

export function DataList<T>({ items, getKey, renderItem, empty = <p>Nothing here.</p>, header }: DataListProps<T>) {
  return (
    <div>
      {header}
      {items.length === 0 ? empty : <ul>{items.map((it, i) => <li key={getKey(it)}>{renderItem(it, i)}</li>)}</ul>}
    </div>
  );
}
export {};
