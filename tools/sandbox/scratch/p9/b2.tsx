import { useRef, type ReactNode } from "react";
import * as React from "react";
let node: HTMLDivElement | null = null;
export function X() {
  const r = useRef();
  const r2 = useRef<HTMLDivElement>(null);
  return <div ref={(el) => (node = el)} />;
}
export const Y: JSX.Element = <div />;
export const Z: React.JSX.Element = <div />;
export type P = { children: ReactNode };
