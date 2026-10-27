function createSelectionStore() {
  let ids: ReadonlySet<string> = new Set();
  const ls = new Set<() => void>();
  return {
    has: (id: string) => ids.has(id),
    all: () => ids,
    toggle(id: string) { const n = new Set(ids); n.has(id) ? n.delete(id) : n.add(id); ids = n; ls.forEach((l) => l()); },
    subscribe(l: () => void) { ls.add(l); return () => { ls.delete(l); }; },
  };
}
export {};
