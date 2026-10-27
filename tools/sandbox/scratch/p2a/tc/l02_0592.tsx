import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";
const BUDGET_MS = 16;
const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  if (actualDuration > BUDGET_MS) console.warn(`[perf] ${id} ${phase} took ${actualDuration.toFixed(1)}ms`);
};
export function Budget({ id, children }: { id: string; children: ReactNode }) {
  return import.meta.env.DEV ? <Profiler id={id} onRender={onRender}>{children}</Profiler> : <>{children}</>;
}
