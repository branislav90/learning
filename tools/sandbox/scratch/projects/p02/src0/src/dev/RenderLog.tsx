// src/dev/RenderLog.tsx
import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  // phase: "mount" | "update" | "nested-update"
  console.log(`[render] ${id} ${phase} ${actualDuration.toFixed(2)}ms`);
};

export function RenderLog({ id, children }: { id: string; children: ReactNode }) {
  if (import.meta.env.PROD) return children;
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}
