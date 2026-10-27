// Before: effect-based fetching with hand-rolled state
function UserPanel({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchUser(id).then(
      (u) => !cancelled && setUser(u),
      (e) => !cancelled && setError(e),
    );
    return () => { cancelled = true; };
  }, [id]);
  if (error) return <ErrorView error={error} />;
  if (!user) return <Spinner />;
  return <UserCard user={user} />;
}
export {};
