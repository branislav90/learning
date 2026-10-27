export function removeMany<T extends { id: string }>(t: EntityTable<T>, ids: readonly string[]): EntityTable<T> {
  const toRemove = new Set(ids.filter((id) => id in t.byId));
  if (toRemove.size === 0) return t;
  const byId = { ...t.byId };
  for (const id of toRemove) delete byId[id];
  return { byId, allIds: t.allIds.filter((id) => !toRemove.has(id)) };
}
export const selectMany = <T extends { id: string }>(t: EntityTable<T>, ids: readonly string[]): T[] =>
  ids.flatMap((id) => (t.byId[id] ? [t.byId[id]] : []));   // dangling ids skipped
export {};
