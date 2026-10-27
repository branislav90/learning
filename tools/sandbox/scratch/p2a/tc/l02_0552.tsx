import { useLayoutEffect, useRef, useState, type RefObject } from "react";

type Size = { width: number; height: number } | null;

export function useMeasure<T extends HTMLElement>(): [RefObject<T | null>, Size] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();           // initial measurement before paint
    setSize({ width: r.width, height: r.height });

    const ro = new ResizeObserver(([entry]) => {   // later changes (async, post-layout)
      const { width, height } = entry.contentRect;
      setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}
