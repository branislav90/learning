// entities.ts
export interface EntityTable<T extends { id: string }> {
  byId: Readonly<Record<string, T>>;
  allIds: readonly string[];
}
export const emptyTable = <T extends { id: string }>(): EntityTable<T> => ({ byId: {}, allIds: [] });

export function upsertMany<T extends { id: string }>(
  table: EntityTable<T>,
  items: readonly T[],
): EntityTable<T> {
  if (items.length === 0) return table;                 // preserve identity when nothing changes
  const byId = { ...table.byId };
  const allIds = [...table.allIds];
  let changed = false;
  for (const item of items) {
    const prev = byId[item.id];
    if (prev === undefined) { allIds.push(item.id); byId[item.id] = item; changed = true; }
    else if (!shallowEqual(prev, item)) { byId[item.id] = { ...prev, ...item }; changed = true; }
  }
  return changed ? { byId, allIds } : table;            // structural sharing at the table level
}

function shallowEqual(a: object, b: object): boolean {
  const ak = Object.keys(a) as Array<keyof typeof a>;
  const bk = Object.keys(b);
  return ak.length === bk.length && ak.every((k) => Object.is(a[k], (b as typeof a)[k]));
}

// Selector: derive the denormalized view
export function selectOrderView(
  orders: EntityTable<Order>,
  customers: EntityTable<Customer>,
  id: string,
): (Order & { customer: Customer | undefined }) | undefined {
  const order = orders.byId[id];
  return order && { ...order, customer: customers.byId[order.customerId] };
}
export {};
