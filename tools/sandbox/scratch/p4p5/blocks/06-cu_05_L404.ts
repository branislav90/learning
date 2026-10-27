let cached: User | null = null;               // module-level
export function useCurrentUser() {
  const [user, setUser] = useState(cached);
  useEffect(() => { if (!cached) loadUser().then((u) => { cached = u; setUser(u); }); }, []);
  return user;
}
export {};
