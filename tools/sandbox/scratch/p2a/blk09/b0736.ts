interface LFiber { name: string; lanes: number; childLanes: number; child: LFiber | null; sibling: LFiber | null; parent: LFiber | null; }

function schedule(f: LFiber, lane: number): void {
  f.lanes |= lane;
  for (let p = f.parent; p; p = p.parent) p.childLanes |= lane;
}

function begin(f: LFiber, renderLanes: number, log: string[]): LFiber | null {
  if ((f.lanes & renderLanes) === 0) {
    if ((f.childLanes & renderLanes) === 0) { log.push(`skip ${f.name}`); return null; }
    log.push(`descend ${f.name}`); return f.child;
  }
  log.push(`render ${f.name}`);
  return f.child;
}
