// BAD 1 (v5): selector builds an object
const { lines, clear } = useCart((s) => ({ lines: s.lines, clear: s.clear }));

// BAD 2: mutating state in an action
add: (id) => set((s) => { s.lines.push({ productId: id, unitPrice: 0, qty: 1 }); return s; }),

// BAD 3: server-owned data in the store, effect-fetched in every consumer
const { users, fetchUsers } = useStore();
useEffect(() => { fetchUsers(); }, []);

// BAD 4: no selector in a hot component
const state = useCart();           // re-renders on any cart change

// BAD 5: module-level store used on the server for per-user data
export const useSession = create(() => ({ user: null as User | null }));
// server: useSession.setState({ user })  // visible to the NEXT request
export {};
