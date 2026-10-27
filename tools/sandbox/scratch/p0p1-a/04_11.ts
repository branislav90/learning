interface Item { id: string; text: string }

export function reconcileList(ul: HTMLUListElement, items: readonly Item[]): void {
  const existing = new Map<string, HTMLLIElement>();
  for (const li of Array.from(ul.children) as HTMLLIElement[]) {
    existing.set(li.dataset.id!, li);
  }
  const wanted = new Set(items.map((i) => i.id));

  // remove missing
  for (const [id, li] of existing) {
    if (!wanted.has(id)) { li.remove(); existing.delete(id); }
  }

  // insert/update/move to match order
  let cursor: ChildNode | null = ul.firstChild;
  for (const item of items) {
    let li = existing.get(item.id);
    if (!li) {
      li = document.createElement("li");
      li.dataset.id = item.id;
      existing.set(item.id, li);
    }
    if (li.textContent !== item.text) li.textContent = item.text;
    if (li === cursor) {
      cursor = cursor.nextSibling;          // already in the right place
    } else {
      ul.insertBefore(li, cursor);           // insert new or move existing
    }
  }
}
