function contains(n: N, id: string): boolean {
  if (n.id === id) return true;
  for (let c = n.child; c; c = c.sibling) if (contains(c, id)) return true;
  return false;
}

// Build a WIP tree where `id`'s text is replaced. (Recursion is for brevity;
// React uses an explicit work loop, see lessons 08-09.)
function renderPath(cur: N, id: string, text: string): N {
  const wip = createWIP(cur);
  if (cur.id === id) {
    wip.text = text; // children stay shared
    return wip;
  }
  let prev: N | null = null;
  wip.child = null;
  for (let c = cur.child; c; c = c.sibling) {
    const w = contains(c, id) ? renderPath(c, id, text) : createWIP(c); // shallow clone, shares c.child
    w.sibling = null;
    if (prev) prev.sibling = w;
    else wip.child = w;
    prev = w;
  }
  return wip;
}

const tree = mk("Root", "", [
  mk("A", "a", [mk("A1", "a1")]),
  mk("B", "b", [mk("B1", "b1"), mk("B2", "b2")]),
]);

const holder = { current: tree };                   // FiberRoot.current
const finished = renderPath(holder.current, "B1", "NEW");

const A = tree.child!;
const B = A.sibling!;
console.log("1", holder.current.child!.sibling!.child!.text);  // committed B1 text
console.log("2", finished.child!.sibling!.child!.text);        // draft B1 text
console.log("3", finished.child!.child === A.child);           // A1 shared?
console.log("4", finished.child!.sibling!.child!.sibling === B.child!.sibling); // B2 shared?
console.log("5", finished.child === A);                        // A cloned?

holder.current = finished;                                      // commit: atomic flip
const next = renderPath(holder.current, "A1", "X");
console.log("6", next === tree);                                // root twin reused?
