function UserBadge({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetch(`/api/users/${userId}`).then((r) => r.json()).then(setUser); }, [userId]);
  const theme = useContext(ThemeContext);
  analytics.track("badge_view");   // side effect during render
  return <span style={{ color: theme.fg }}>{user?.name ?? "…"}</span>;
}
export {};
