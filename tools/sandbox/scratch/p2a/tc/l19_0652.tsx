import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useMeasure<T extends HTMLElement>(): [RefObject<T | null>, DOMRect | null] {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const next = el.getBoundingClientRect();
    setRect((prev) =>
      prev && prev.width === next.width && prev.height === next.height && prev.x === next.x && prev.y === next.y ? prev : next,
    );
  }, []);

  useIsoLayoutEffect(() => { update(); }, [update]);          // initial measure before paint

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => update());            // later size changes
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  return [ref, rect];
}
