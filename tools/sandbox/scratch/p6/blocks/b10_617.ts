persist(creator, {
  name: 'list',
  version: 2,
  migrate: (persisted: unknown, version) => {
    if (version < 2) {
      const old = persisted as { items: string[] };
      return { items: old.items.map((id) => ({ id, qty: 1 })) };
    }
    return persisted as { items: { id: string; qty: number }[] };
  },
});
export {};
