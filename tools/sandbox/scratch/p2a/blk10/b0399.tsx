const cache = new Map<string, number>(); // module scope, shared across all renders

function Price({ sku }: { sku: string }) {
  // ❌ writes to shared mutable state during render
  if (!cache.has(sku)) cache.set(sku, Date.now());
  return <span>{cache.get(sku)}</span>;
}
