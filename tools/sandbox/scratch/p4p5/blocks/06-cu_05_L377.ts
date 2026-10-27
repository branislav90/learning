// use-resize-observer.ts
import { useCallback, useState } from "react";

export function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    if (node === null) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();     // ⚠ React 19 ref-callback cleanup
  }, []);

  return [ref, size] as const;
}
export {};
