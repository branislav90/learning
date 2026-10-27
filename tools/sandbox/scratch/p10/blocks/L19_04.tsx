// SavedMethodsList.tsx (before)
export function SavedMethodsList({ methods }: { methods: readonly PaymentMethod[] }) {
  const sorted = methods.toSorted((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt)); // ❌ not available on Safari 15
  return (
    <ul>{sorted.map((m) => <li key={m.id}><PaymentMethodRow method={m} /></li>)}</ul>
  );
}
