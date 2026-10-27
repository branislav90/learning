// plan-children.ts
export type Child = { key: string | null; type: string };
export type Op =
  | { op: "reuse"; id: string }     // matched, stays in place
  | { op: "move"; id: string }      // matched, DOM node must be re-inserted
  | { op: "insert"; id: string }    // new fiber + DOM
  | { op: "delete"; id: string };   // removed (state lost)

export function plan(oldC: readonly Child[], newC: readonly Child[]): Op[] {
  const idOf = (c: Child, i: number): string => c.key ?? `#${i}`;
  const oldMap = new Map<string, { c: Child; index: number }>();
  oldC.forEach((c, i) => oldMap.set(idOf(c, i), { c, index: i }));

  const ops: Op[] = [];
  let lastPlaced = 0;
  newC.forEach((c, i) => {
    const id = idOf(c, i);
    const hit = oldMap.get(id);
    if (hit && hit.c.type === c.type) {
      oldMap.delete(id);
      if (hit.index < lastPlaced) ops.push({ op: "move", id });
      else { lastPlaced = hit.index; ops.push({ op: "reuse", id }); }
    } else {
      ops.push({ op: "insert", id });         // same key, different type: old stays in map and is deleted below
    }
  });
  for (const id of oldMap.keys()) ops.push({ op: "delete", id });
  return ops;
}

// Demo
const k = (key: string, type = "li"): Child => ({ key, type });
const u = (type = "li"): Child => ({ key: null, type });

console.log(plan([k("a"), k("b"), k("c"), k("d")], [k("d"), k("a"), k("b"), k("c")]));
console.log(plan([k("a"), k("b"), k("c"), k("d")], [k("b"), k("c"), k("d"), k("a")]));
console.log(plan([u(), u()], [u(), u(), u()]));              // unkeyed append
console.log(plan([k("a"), k("b")], [k("z"), k("a"), k("b")])); // keyed prepend
console.log(plan([u(), u()], [u("section"), u(), u()]));      // unkeyed with type change at 0
