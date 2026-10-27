function UserProfileBad({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(async () => {                         // (1)
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();               // (2)
      setUser(data);                               // (3)
    } catch (e) {
      setError('failed');                          // (4)
    }
    setLoading(false);
  }, []);                                          // (5)

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  return <h1>{user.name}</h1>;                     // (6)
}
export {};
