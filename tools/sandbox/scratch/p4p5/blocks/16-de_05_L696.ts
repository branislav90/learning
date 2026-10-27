export const fixedClock = (t: number): Clock => ({ now: () => t });
export function advancingClock(start: number, stepMs: number): Clock & { tick(): void } {
  let t = start;
  return { now: () => t, tick() { t += stepMs; } };
}
export {};
