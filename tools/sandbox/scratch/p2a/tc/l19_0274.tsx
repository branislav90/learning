import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

interface Position { top: number; left: number; placement: "bottom" | "top" }

export function Popover({
  anchorRef,
  open,
  children,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  children: ReactNode;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position | null>(null);

  useLayoutEffect(() => {
    if (!open) { setPos(null); return; }
    const anchor = anchorRef.current;
    const pop = popRef.current;
    if (!anchor || !pop) return;

    // READS first (single forced layout)
    const a = anchor.getBoundingClientRect();
    const p = pop.getBoundingClientRect();
    const vh = document.documentElement.clientHeight;
    const vw = document.documentElement.clientWidth;

    // compute (pure)
    const placement: Position["placement"] = a.bottom + p.height > vh && a.top - p.height > 0 ? "top" : "bottom";
    const top = (placement === "bottom" ? a.bottom : a.top - p.height) + window.scrollY;
    const left = Math.min(Math.max(a.left, 8), vw - p.width - 8) + window.scrollX;

    // WRITE once, via state
    setPos((prev) =>
      prev && prev.top === top && prev.left === left && prev.placement === placement ? prev : { top, left, placement },
    );
  }, [open, anchorRef]);

  if (!open) return null;
  return (
    <div
      ref={popRef}
      role="dialog"
      style={{
        position: "absolute",
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        visibility: pos ? "visible" : "hidden",     // avoid showing the unpositioned first commit even if effect timing slips
      }}
    >
      {children}
    </div>
  );
}
