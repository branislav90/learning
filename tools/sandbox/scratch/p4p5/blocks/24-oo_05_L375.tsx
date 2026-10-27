// ❌ Server: one shared mutable cache across all users
export const userCache = new Map<string, User>();

// ✅ Create per request / per app instance and provide via context
const CacheContext = createContext<Map<string, User> | null>(null);

export function CacheProvider({ children }: { children: ReactNode }) {
  const [cache] = useState(() => new Map<string, User>()); // lazy initializer; no side effects
  return <CacheContext value={cache}>{children}</CacheContext>;
}
export {};
