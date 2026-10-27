// list.tsx
import type { Key, ReactNode } from "react";

type ListProps<T> = {
  items: readonly T[];
  /** Stable identity for each item. Required: the list owns the keys. */
  getKey: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  "aria-label"?: string;
};

export function List<T>({ items, getKey, renderItem, renderEmpty, ...rest }: ListProps<T>) {
  if (items.length === 0) return <>{renderEmpty?.() ?? null}</>;
  return (
    <ul {...rest}>
      {items.map((item, index) => (
        <li key={getKey(item, index)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
export {};
