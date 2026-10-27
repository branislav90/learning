export interface Item { key: string; text: string }

export type Op =
  | { type: "remove"; key: string }
  | { type: "insert"; key: string; before: string | null; text: string }
  | { type: "move"; key: string; before: string | null }
  | { type: "setText"; key: string; text: string };

/** Plan the DOM operations that turn `prev` into `next` (keyed children of one parent). */
export function planKeyed(prev: readonly Item[], next: readonly Item[]): Op[] {
  const prevIndex = new Map(prev.map((p, i) => [p.key, i] as const));
  const prevText = new Map(prev.map((p) => [p.key, p.text] as const));
  const nextKeys = new Set(next.map((n) => n.key));
  const ops: Op[] = [];

  // 1) Deletions first (a parent's ChildDeletion work precedes its other mutations).
  for (const p of prev) if (!nextKeys.has(p.key)) ops.push({ type: "remove", key: p.key });

  // 2) Render-phase decision: which fibers get a Placement flag?
  const flagged = new Set<string>();
  let lastPlacedIndex = 0;
  for (const n of next) {
    const oldIndex = prevIndex.get(n.key);
    if (oldIndex === undefined) flagged.add(n.key);          // new → insert
    else if (oldIndex < lastPlacedIndex) flagged.add(n.key); // moved
    else lastPlacedIndex = oldIndex;                         // stays
  }

  // 3) Commit: walk new children in order; place flagged ones before the next stable sibling.
  next.forEach((n, i) => {
    if (flagged.has(n.key)) {
      let before: string | null = null;
      for (let j = i + 1; j < next.length; j++) {
        const k = next[j].key;
        if (prevIndex.has(k) && !flagged.has(k)) { before = k; break; }   // "getHostSibling"
      }
      ops.push(
        prevIndex.has(n.key)
          ? { type: "move", key: n.key, before }
          : { type: "insert", key: n.key, before, text: n.text },
      );
    }
    const old = prevText.get(n.key);
    if (old !== undefined && old !== n.text) ops.push({ type: "setText", key: n.key, text: n.text });
  });
  return ops;
}

/** Apply operations to an array standing in for DOM children (to verify the plan). */
export function applyOps(dom: readonly Item[], ops: readonly Op[]): Item[] {
  const list = dom.map((x) => ({ ...x }));
  for (const op of ops) {
    if (op.type === "remove") { list.splice(list.findIndex((x) => x.key === op.key), 1); continue; }
    if (op.type === "setText") { const t = list.find((x) => x.key === op.key); if (t) t.text = op.text; continue; }
    const node =
      op.type === "move"
        ? list.splice(list.findIndex((x) => x.key === op.key), 1)[0]
        : { key: op.key, text: op.text };
    const at = op.before === null ? list.length : list.findIndex((x) => x.key === op.before);
    list.splice(at, 0, node);
  }
  return list;
}

const mk=(s:string)=>[...s].map(c=>({key:c,text:c.toLowerCase()}));
for (const [a,b] of [['ABC','BCA'],['ABC','CAB'],['ABCD','BCD'],['ABC','XABC'],['ABCD','DCBA'],['ABCD','DBXA']]) {
 const ops=planKeyed(mk(a),mk(b)); const r=applyOps(mk(a),ops).map(x=>x.key).join('');
 console.log(a,b,JSON.stringify(ops.map(o=>o.type+' '+o.key+(('before' in o)?' before '+o.before:''))), r===b);
}
