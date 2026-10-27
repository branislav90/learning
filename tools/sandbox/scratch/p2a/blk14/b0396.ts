// Toy implementation of React's "base state / base queue" idea. NOT React's code.
interface Update {
  lane: number;                 // 0 = "no lane" = always included (used for rebased clones)
  apply: (state: number) => number;
  label: string;
}
interface Hook {
  baseState: number;
  baseQueue: Update[];
  memoizedState: number;
}

const isSubset = (set: number, subset: number): boolean => (set & subset) === subset;

function processQueue(hook: Hook, pending: Update[], renderLanes: number): Hook {
  const queue = [...hook.baseQueue, ...pending];
  let newState = hook.baseState;
  let newBaseState = hook.baseState;
  const newBaseQueue: Update[] = [];
  let skipped = false;

  for (const u of queue) {
    if (!isSubset(renderLanes, u.lane)) {
      // Not part of this render: skip it, remember the state it must be applied on top of.
      if (!skipped) {
        skipped = true;
        newBaseState = newState;
      }
      newBaseQueue.push(u);
    } else {
      // Included: apply for display. If anything was skipped earlier, keep a clone
      // (lane cleared) so it is replayed in order later.
      if (skipped) newBaseQueue.push({ ...u, lane: 0 });
      newState = u.apply(newState);
    }
  }
  return {
    memoizedState: newState,
    baseState: skipped ? newBaseState : newState,
    baseQueue: skipped ? newBaseQueue : [],
  };
}

// ---- Worked example from §2.6 ----
const SYNC = 0b01;
const TRANS = 0b10;
const updates: Update[] = [
  { lane: TRANS, apply: (s) => s + 1, label: "T:+1" },
  { lane: SYNC, apply: (s) => s * 2, label: "U:*2" },
];

let hook: Hook = { baseState: 1, baseQueue: [], memoizedState: 1 };
hook = processQueue(hook, updates, SYNC);
console.log(hook.memoizedState, hook.baseState, hook.baseQueue.map((u) => `${u.label}@${u.lane}`));
hook = processQueue(hook, [], TRANS);
console.log(hook.memoizedState, hook.baseState, hook.baseQueue.length);

// ---- Property: any order of rendering the lanes ends at the sequential result ----
function sequential(initial: number, ups: Update[]): number {
  return ups.reduce((s, u) => u.apply(s), initial);
}
function permutations<T>(xs: T[]): T[][] {
  if (xs.length <= 1) return [xs];
  return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

const LANES = [0b001, 0b010, 0b100];
const ups: Update[] = [
  { lane: 0b100, apply: (s) => s + 3, label: "a:+3" },
  { lane: 0b001, apply: (s) => s * 2, label: "b:*2" },
  { lane: 0b010, apply: (s) => s - 1, label: "c:-1" },
  { lane: 0b100, apply: (s) => s * 5, label: "d:*5" },
];
const expected = sequential(7, ups);
for (const order of permutations(LANES)) {
  let h: Hook = { baseState: 7, baseQueue: [], memoizedState: 7 };
  let first = true;
  for (const lane of order) {
    h = processQueue(h, first ? ups : [], lane);
    first = false;
  }
  console.assert(h.memoizedState === expected, `order ${order} -> ${h.memoizedState} !== ${expected}`);
}
console.log("sequential =", expected);
