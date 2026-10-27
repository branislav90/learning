export {};
import type { ReactNode } from "react";

interface ListProps<T> {
  items: readonly T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  empty?: ReactNode;
}

export function List<T>({ items, getKey, renderItem, empty = <p>No items.</p> }: ListProps<T>) {
  if (items.length === 0) return <>{empty}</>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={getKey(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

interface Option<V extends string | number> { value: V; label: string }
interface SelectProps<V extends string | number> {
  value: V;
  options: readonly Option<V>[];
  onChange: (value: V) => void;
}

export function Select<V extends string | number>({ value, options, onChange }: SelectProps<V>) {
  return (
    <select
      value={value}
      onChange={(e) => {
        const chosen = options.find((o) => String(o.value) === e.currentTarget.value);
        if (chosen) onChange(chosen.value);        // value returned with its original type, not a string
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
