export function assertUniqueKeys<T>(items: readonly T[], getKey: (item: T) => string | number, where: string): void {
  if (process.env.NODE_ENV === "production") return;          // bundler-provided; use import.meta.env.DEV in Vite
  const seen = new Map<string, number>();
  items.forEach((item, i) => {
    const k = String(getKey(item));
    if (seen.has(k)) {
      console.error(`[${where}] duplicate key "${k}" at indexes ${seen.get(k)} and ${i}`);
    } else {
      seen.set(k, i);
    }
  });
}
// usage: assertUniqueKeys(orders, (o) => o.id, "OrdersTable"); before rendering the list
