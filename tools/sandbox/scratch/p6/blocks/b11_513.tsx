export function createScopedStore<T extends object>(makeInitial: () => T) {
  const Ctx = createContext<ReturnType<typeof createStore<T>> | null>(null);
  function Provider({ children }: { children: ReactNode }) {
    const [store] = useState(() => createStore(makeInitial()));
    return <Ctx value={store}>{children}</Ctx>;
  }
  function useSelector<S>(sel: (s: T) => S): S {
    const store = use(Ctx);
    if (!store) throw new Error('Missing provider');
    return useStoreSelector(store, sel);
  }
  return { Provider, useSelector };
}
export {};
