const Ctx = createContext<Api>({} as Api);
export const useApi = () => useContext(Ctx);
export {};
