import { useEffect, useLayoutEffect, useRef, useState } from "react";

function Box({ useLayout }: { useLayout: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const useIt = useLayout ? useLayoutEffect : useEffect;   // constant per component type, see note

  useIt(() => {
    const el = ref.current;
    if (el) setWidth(el.getBoundingClientRect().width);
  }, []);

  return (
    <div ref={ref} style={{ resize: "horizontal", overflow: "auto", width: 200, border: "1px solid" }}>
      measured width: {width}
    </div>
  );
}
export {};
