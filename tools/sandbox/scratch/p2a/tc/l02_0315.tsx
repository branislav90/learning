import { Profiler, useLayoutEffect, type ProfilerOnRenderCallback, type ReactNode } from "react";

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  // phase: "mount" | "update" | "nested-update"
  console.table({ id, phase, actualDuration, baseDuration, startTime, commitTime });
};

/** Approximate "after the next paint" without any React API. A heuristic, not a guarantee. */
function afterNextPaint(cb: () => void): void {
  requestAnimationFrame(() => {
    // rAF runs before paint in the frame; a message/timeout posted now runs after that frame's work.
    const ch = new MessageChannel();
    ch.port1.onmessage = () => cb();
    ch.port2.postMessage(null);
  });
}

export function Measured({ id, children }: { id: string; children: ReactNode }) {
  useLayoutEffect(() => {
    const t0 = performance.now();                       // inside commit, before paint
    afterNextPaint(() => {
      console.log(`${id}: commit→(approx)paint ≈ ${(performance.now() - t0).toFixed(1)}ms`);
    });
  });
  return <Profiler id={id} onRender={onRender}>{children}</Profiler>;
}
