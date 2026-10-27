interface Unit {
  name: string;
  child: Unit | null;
  sibling: Unit | null;
  parent: Unit | null; // React calls this pointer `return`
}

function toUnits(node: TreeNode, parent: Unit | null = null): Unit {
  const unit: Unit = { name: node.name, child: null, sibling: null, parent };
  let previous: Unit | null = null;
  for (const childNode of node.children ?? []) {
    const childUnit = toUnits(childNode, unit);
    if (previous) previous.sibling = childUnit;
    else unit.child = childUnit;
    previous = childUnit;
  }
  return unit;
}

// Process one unit; return the next unit to process (or null when done).
function performUnitOfWork(unit: Unit, log: string[]): Unit | null {
  log.push(`begin ${unit.name}`);
  if (unit.child) return unit.child; // go down

  // No children: complete this unit, then walk up/across.
  let current: Unit | null = unit;
  while (current) {
    log.push(`complete ${current.name}`);
    if (current.sibling) return current.sibling; // go across
    current = current.parent;                    // go up
  }
  return null; // whole tree done
}

function workLoop(
  start: Unit,
  log: string[],
  shouldYield: () => boolean,
): Unit | null {
  let next: Unit | null = start;
  while (next !== null && !shouldYield()) {
    next = performUnitOfWork(next, log);
  }
  return next; // non-null = paused; pass it back in later to resume
}

// Drive it: yield after every 2 units, resuming each time.
const rootUnit = toUnits(tree);
const log2: string[] = [];
let cursor: Unit | null = rootUnit;
let budget = 0;
while (cursor) {
  budget = 2;
  cursor = workLoop(cursor, log2, () => budget-- <= 0);
  log2.push("--- yielded to browser ---");
}
console.log(log2.join("\n"));
