import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface TooltipProps {
  anchor: HTMLElement | null;
  children: ReactNode;
}

export function Tooltip({ anchor, children }: TooltipProps) {
  const tipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchor || !tipRef.current) return;
    const a = anchor.getBoundingClientRect();
    const t = tipRef.current.getBoundingClientRect();
    setPos({ top: a.top - t.height - 8 + window.scrollY, left: a.left + (a.width - t.width) / 2 + window.scrollX });
  }, [anchor, children]);

  return (
    <div
      ref={tipRef}
      role="tooltip"
      style={{
        position: "absolute",
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        visibility: pos ? "visible" : "hidden", // avoid showing at (0,0) on first commit
      }}
    >
      {children}
    </div>
  );
}
