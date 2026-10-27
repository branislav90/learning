const GROUPS: number[] = [SyncLane, ContinuousLane, DefaultLane, TransitionLanes, IdleLane];

function getNextLanes(pending: number, suspended: number, pinged: number, inProgress: number): number {
  const eligible = pending & ~(suspended & ~pinged);   // drop suspended unless pinged
  if (eligible === 0) return 0;
  let next = 0;
  for (const g of GROUPS) {
    const m = eligible & g;
    if (m !== 0) { next = g === TransitionLanes ? m : (m & -m); break; }
  }
  if (inProgress !== 0 && next !== 0) {
    // Don't interrupt a render with LESS urgent work: lower priority = higher bit.
    if ((next & -next) > (inProgress & -inProgress)) return inProgress;
  }
  return next;
}
