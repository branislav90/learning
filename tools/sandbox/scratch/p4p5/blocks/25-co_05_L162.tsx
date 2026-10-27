type Sort = "name" | "price";
type View = { query: string; sort: Sort; page: number };
const PAGE_SIZE = 20;

export function selectVisible(products: readonly Product[], view: View): Product[] {
  const q = view.query.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q));
  const sorted = [...filtered].sort((a, b) =>
    view.sort === "name" ? a.name.localeCompare(b.name) : a.price - b.price,
  );
  return sorted.slice((view.page - 1) * PAGE_SIZE, view.page * PAGE_SIZE);
}
export {};
