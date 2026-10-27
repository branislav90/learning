const UPDATE = 0b01;

interface Fiber {
  name: string;
  child: Fiber | null;
  sibling: Fiber | null;
  parent: Fiber | null;   // React: `return`
  hasWork: boolean;       // React: roughly `lanes` intersects the render lanes
  childHasWork: boolean;  // React: roughly `childLanes` intersects
  flags: number;
  subtreeFlags: number;
}

function mk(name: string, children: Fiber[] = []): Fiber {
  const f: Fiber = {
    name,
    child: children[0] ?? null,
    sibling: null,
    parent: null,
    hasWork: false,
    childHasWork: false,
    flags: 0,
    subtreeFlags: 0,
  };
  children.forEach((c, i) => {
    c.parent = f;
    c.sibling = children[i + 1] ?? null;
  });
  return f;
}

// "setState": mark the fiber, then walk up marking ancestors.
function scheduleUpdate(f: Fiber): void {
  f.hasWork = true;
  for (let p = f.parent; p; p = p.parent) p.childHasWork = true;
}

function beginWork(f: Fiber, log: string[]): Fiber | null {
  if (!f.hasWork) {
    if (!f.childHasWork) {
      log.push(`skip ${f.name}`);       // bailout: skip the entire subtree
      return null;
    }
    log.push(`descend ${f.name}`);      // bailout but must visit descendants
    return f.child;
  }
  log.push(`render ${f.name}`);         // "calls the component"
  f.flags |= UPDATE;
  for (let c = f.child; c; c = c.sibling) c.hasWork = true; // new props objects
  return f.child;
}

function completeWork(f: Fiber, log: string[]): void {
  log.push(`complete ${f.name}`);
  for (let c = f.child; c; c = c.sibling) {
    f.subtreeFlags |= c.flags | c.subtreeFlags; // bubble
  }
}

function performUnitOfWork(f: Fiber, log: string[]): Fiber | null {
  const next = beginWork(f, log);
  if (next) return next;
  let cur: Fiber | null = f;
  while (cur) {
    completeWork(cur, log);
    if (cur.sibling) return cur.sibling;
    cur = cur.parent;
  }
  return null;
}

// Build:  App > [Header, Counter > [Button, Label]]
const header = mk("Header");
const counter = mk("Counter", [mk("Button"), mk("Label")]);
const app = mk("App", [header, counter]);

scheduleUpdate(counter);

const log: string[] = [];
for (let next: Fiber | null = app; next; ) next = performUnitOfWork(next, log);
console.log(log.join("\n"));
console.log("App.subtreeFlags =", app.subtreeFlags, "| Header.flags =", header.flags);
