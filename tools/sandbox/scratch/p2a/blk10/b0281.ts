interface N {
  id: string;
  text: string;
  child: N | null;
  sibling: N | null;
  alternate: N | null;
}

function mk(id: string, text: string, children: N[] = []): N {
  const node: N = { id, text, child: children[0] ?? null, sibling: null, alternate: null };
  children.forEach((c, i) => {
    c.sibling = children[i + 1] ?? null;
  });
  return node;
}

// Conceptually React's createWorkInProgress.
function createWIP(cur: N): N {
  let wip = cur.alternate;
  if (wip === null) {
    wip = { ...cur, alternate: cur }; // first update at this position: allocate twin
    cur.alternate = wip;
  } else {
    wip.id = cur.id; // reuse the idle twin: recopy inputs
    wip.text = cur.text;
    wip.child = cur.child;
    wip.sibling = cur.sibling;
  }
  return wip;
}

const root = mk("Root", "", [mk("A", "a"), mk("B", "b")]);
const w1 = createWIP(root);
const w2 = createWIP(w1); // twin of the twin
console.log(w1 === root, w1.alternate === root, root.alternate === w1, w2 === root);
