export {};
// ✅
const total = items.reduce((s, i) => s + i.price * i.qty, 0);
// if profiling shows cost: const total = useMemo(() => ..., [items]);
