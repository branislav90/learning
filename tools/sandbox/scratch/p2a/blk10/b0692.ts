function diffTexts(oldRoot: N, finished: N): string[] {
  const out: string[] = [];
  function walk(oldNode: N | null, newNode: N | null): void {
    if (oldNode === newNode) return;             // shared subtree: nothing changed below
    if (!oldNode || !newNode) return;            // (insert/delete omitted in this toy)
    if (oldNode.text !== newNode.text) out.push(newNode.id);
    walk(oldNode.child, newNode.child);
    walk(oldNode.sibling, newNode.sibling);
  }
  walk(oldRoot, finished);
  return out;
}
