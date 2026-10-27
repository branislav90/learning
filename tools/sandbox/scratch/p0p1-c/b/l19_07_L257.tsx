export {};
import type { ReactNode, ChangeEvent, MouseEvent } from "react";

interface CardProps {
  title: string;
  children: ReactNode;          // strings, numbers, elements, arrays, null: anything renderable
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function Card({ title, children, onClose }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
      {onClose && <button onClick={onClose}>Close</button>}
    </section>
  );
}

export function SearchBox({ value, onChange }: {
  value: string;
  onChange: (next: string) => void;
}) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value);
  return <input value={value} onChange={handle} />;
}
