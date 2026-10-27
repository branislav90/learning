import { useState, type ReactNode } from "react";
type Props =
  | { open: boolean; onOpenChange: (o: boolean) => void; defaultOpen?: never; children: ReactNode; summary: ReactNode }
  | { open?: undefined; onOpenChange?: (o: boolean) => void; defaultOpen?: boolean; children: ReactNode; summary: ReactNode };

export function Disclosure(props: Props) {
  const [inner, setInner] = useState(props.defaultOpen ?? false);
  const controlled = props.open !== undefined;
  const open = controlled ? props.open! : inner;
  const toggle = () => {
    const next = !open;
    if (!controlled) setInner(next);
    props.onOpenChange?.(next);
  };
  return (<div><button aria-expanded={open} onClick={toggle}>{props.summary}</button>{open && <div>{props.children}</div>}</div>);
}
export {};
