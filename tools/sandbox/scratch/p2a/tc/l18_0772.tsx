import { useEffect, useRef, type RefObject } from "react";

export function useOnClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, handler: (e: PointerEvent) => void): void {
  const latest = useRef(handler);
  useEffect(() => { latest.current = handler; });
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) latest.current(e);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [ref]);
}
