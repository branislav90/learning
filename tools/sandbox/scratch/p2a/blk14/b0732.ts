interface LFiber { name: string; lanes: number; childLanes: number; child: LFiber | null; sibling: LFiber | null; parent: LFiber | null }
function scheduleUpdate(f: LFiber, lane: number): void {
  f.lanes |= lane;
  for (let p = f.parent; p; p = p.parent) p.childLanes |= lane;
}
function render(f: LFiber, renderLanes: number, visited: string[]): void {
  const hasWork = (f.lanes & renderLanes) !== 0;
  const childWork = (f.childLanes & renderLanes) !== 0;
  if (!hasWork && !childWork) return;                 // prune
  if (hasWork) { visited.push(f.name); f.lanes &= ~renderLanes; } // work done in these lanes
  for (let c = f.child; c; c = c.sibling) render(c, renderLanes, visited);
  f.childLanes = recomputeChildLanes(f);              // children's lanes after this render
}
function recomputeChildLanes(f: LFiber): number {
  let m = 0;
  for (let c = f.child; c; c = c.sibling) m |= c.lanes | c.childLanes;
  return m;
}
