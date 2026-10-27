import { useRef, type ComponentPropsWithRef, type Ref, type ReactNode } from "react";
export function Input(props: ComponentPropsWithRef<"input">) { return <input {...props} />; }
export function Generic<T extends { id: string }>({ items, ref, render }: { items: T[]; ref?: Ref<HTMLUListElement>; render: (t: T) => ReactNode }) { return <ul ref={ref}>{items.map((i) => <li key={i.id}>{render(i)}</li>)}</ul>; }
export function Bad() {
  let x: HTMLDivElement | null = null;
  const r = useRef<HTMLDivElement>(null);
  // @ts-expect-error React 19 types: ref callback must not return a non-function value
  return <div ref={(el) => (x = el)}><span ref={r as never} />{String(x)}</div>;
}
export const j: JSX.Element = <p />;
// @ts-expect-error useRef requires an argument in React 19 types
const noArg = useRef<number>();
const arr: string[] = ["a"]; const first = arr[0]; first.length;
