function snapshot(n: N | null): unknown {
  if (!n) return null;
  return { id: n.id, text: n.text, child: snapshot(n.child), sibling: snapshot(n.sibling) };
}

const before = JSON.stringify(snapshot(holder.current));
const draft = renderPath(holder.current, "B1", "DRAFT");   // never committed
void draft;
console.assert(JSON.stringify(snapshot(holder.current)) === before, "current must be untouched");
