export {};
// 🔴 correctness depends on useMemo returning the same value
const id = useMemo(() => crypto.randomUUID(), []);
