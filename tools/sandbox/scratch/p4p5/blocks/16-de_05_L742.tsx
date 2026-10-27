export function createServicesContext<S extends object>(name: string) {
  const Ctx = createContext<S | null>(null);
  const useAll = (): S => {
    const s = use(Ctx);
    if (s === null) throw new Error(`${name}: missing provider`);
    return s;
  };
  function Provider({ services, children }: { services: S; children: ReactNode }) {
    return <Ctx value={services}>{children}</Ctx>;
  }
  const useService = <K extends keyof S>(k: K): S[K] => useAll()[k];
  const withOverrides = (parent: S, o: Partial<S>): S => {
    const keys = Object.keys(o) as Array<keyof S>;
    return keys.every((k) => Object.is(parent[k], o[k])) ? parent : { ...parent, ...o };
  };
  return { Provider, useServices: useAll, useService, withOverrides };
}
export {};
