interface EntityState<T> { byId: Record<string, T>; allIds: string[] }

interface State {
  users:   EntityState<User>;                       // { u7: { id:'u7', name:'Ana' } }
  cards:   EntityState<{ id: string; title: string; assigneeId: string }>;
  columns: EntityState<{ id: string; cardIds: string[] }>;
}
export {};
