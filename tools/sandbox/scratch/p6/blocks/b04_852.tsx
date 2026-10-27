export function mergeById<T extends { id: string }>(existing: readonly T[], incoming: readonly T[]): T[] {
  const incomingById = new Map(incoming.map((x) => [x.id, x]));
  const merged = existing.map((x) => incomingById.get(x.id) ?? x);
  const seen = new Set(existing.map((x) => x.id));
  return [...merged, ...incoming.filter((x) => !seen.has(x.id))];
}
export {};
