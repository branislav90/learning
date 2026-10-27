import { useRef } from "react";

export function useRenderCount(): number {
  const count = useRef(0);
  count.current += 1;   // mutation during render: acceptable for debug-only counters
  return count.current;
}
