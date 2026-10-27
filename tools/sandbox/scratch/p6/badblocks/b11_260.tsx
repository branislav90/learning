// BAD 1: one mega-context with fast-changing and slow-changing data
<AppCtx value={{ user, theme, cart, mousePos, setCart }}>   {/* new object every render */}
// every mouse move re-renders every consumer of anything

// BAD 2: context as a store replacement for high-frequency data
const [pointer, setPointer] = useState({ x: 0, y: 0 });
return <PointerCtx value={pointer}>{children}</PointerCtx>;   // 60+ updates/s to all consumers

// BAD 3: default value hides a missing provider
const ThemeCtx = createContext({ theme: 'light', setTheme: () => {} });   // setTheme silently does nothing

// BAD 4: store module-level singleton + SSR
export const useUser = create(() => ({ user: null }));  // shared across requests on the server
export {};
