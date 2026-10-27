const filtered = useMemo(() => items.filter(i => i.name.includes(query)), [items, query]);
export {};
