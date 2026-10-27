interface Row { id: number; name: string }

function renderRows(list: HTMLUListElement, rows: readonly Row[]): void {
  const frag = document.createDocumentFragment();
  for (const r of rows) {
    const li = document.createElement("li");
    li.dataset.id = String(r.id);
    li.textContent = r.name;               // safe against injection
    frag.append(li);
  }
  list.replaceChildren(frag);              // clear + insert in one operation
}
