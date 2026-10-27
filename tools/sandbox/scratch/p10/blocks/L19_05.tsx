// SavedMethodsList.tsx (after)
export function SavedMethodsList({ methods }: { methods: readonly PaymentMethod[] }) {
  // Copy then sort: works in all supported browsers; does not mutate props.
  const sorted = [...methods].sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt));
  return <ul>{sorted.map((m) => <li key={m.id}><PaymentMethodRow method={m} /></li>)}</ul>;
}
