import { useRef } from "react";
export function useWhyDidYouRender(name: string, props: Record<string, unknown>): void {
  const prev = useRef<Record<string, unknown> | null>(null);
  if (process.env.NODE_ENV !== "production" && prev.current) {
    const changed = Object.keys({ ...prev.current, ...props }).filter(
      (k) => !Object.is(prev.current![k], props[k]),
    );
    if (changed.length) console.log(`[${name}] changed props:`, changed);
    else console.log(`[${name}] rendered with identical props (parent/state/context caused it)`);
  }
  prev.current = props;   // ⚠ writing a ref in render: acceptable only for dev diagnostics
}
