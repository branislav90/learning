export {};
// 🔴
<Ctx value={{ user, setUser }}>{children}</Ctx> // new object every render → all consumers re-render
// ✅
const value = useMemo(() => ({ user, setUser }), [user]);
