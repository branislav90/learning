import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type TooltipProps = { anchor: DOMRect; children: ReactNode };

export function Tooltip({ anchor, children }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(anchor.bottom + 8);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { height } = el.getBoundingClientRect();           // forces layout
    const fitsBelow = anchor.bottom + 8 + height <= window.innerHeight;
    setTop(fitsBelow ? anchor.bottom + 8 : anchor.top - 8 - height);
  }, [anchor]);

  return (
    <div ref={ref} role="tooltip" style={{ position: "fixed", left: anchor.left, top }}>
      {children}
    </div>
  );
}
