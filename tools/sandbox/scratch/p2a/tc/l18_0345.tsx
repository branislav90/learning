import { useEffect, useLayoutEffect, useState } from "react";

export function PaintProbe() {
  const [n, setN] = useState(0);

  useLayoutEffect(() => {
    performance.mark(`layout-${n}`);
  });

  useEffect(() => {
    performance.mark(`passive-${n}`);
    // requestAnimationFrame callbacks run at the next rendering opportunity (before that frame's paint)
    requestAnimationFrame(() => performance.mark(`raf-after-passive-${n}`));
  });

  return (
    <button
      onClick={() => {
        // Not a discrete React event on purpose: schedule the state change from a timer
        setTimeout(() => setN((v) => v + 1), 0);
      }}
    >
      {n}
    </button>
  );
}
