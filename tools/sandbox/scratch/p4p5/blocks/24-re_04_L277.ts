// features/transactions/domain/transactions.ts
export interface Transaction { id: string; date: string; amount: number; status: "OK" | "VOID" | "DISPUTED" }
export type SortKey = "date" | "amount";

export function visibleTransactions(all: readonly Transaction[], sort: SortKey): Transaction[] {
  return all
    .filter((t) => t.status !== "VOID")
    .toSorted((a, b) => (sort === "date" ? b.date.localeCompare(a.date) : b.amount - a.amount));
}

export function selectedTotal(rows: readonly Transaction[], selected: readonly string[]): number {
  const set = new Set(selected);
  return rows.filter((r) => set.has(r.id)).reduce((s, r) => s + r.amount, 0);
}

export function toggle(selected: readonly string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
}
export {};
