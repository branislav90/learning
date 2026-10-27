function createSessionStore(initial: User | null) {
  let user = initial;
  const ls = new Set<() => void>();
  return {
    get: () => user,
    set(u: User | null) { user = u; ls.forEach((l) => l()); },
    subscribe(l: () => void) { ls.add(l); return () => { ls.delete(l); }; },
  };
}
const SessionContext = createContext<ReturnType<typeof createSessionStore> | null>(null);

function SessionProvider({ initialUser, children }: { initialUser: User | null; children: React.ReactNode }) {
  const [store] = useState(() => createSessionStore(initialUser));   // one per provider instance
  return <SessionContext value={store}>{children}</SessionContext>;
}
function useSessionUser() {
  const store = use(SessionContext);
  if (!store) throw new Error("SessionProvider missing");
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
export {};
