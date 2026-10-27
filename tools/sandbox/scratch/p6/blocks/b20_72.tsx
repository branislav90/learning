function User({ id }: { id: string }) {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/users/${id}`)
      .then((r) => r.json() as Promise<UserDto>)
      .then((u) => { if (!ignore) setUser(u); });
    return () => { ignore = true; };
  }, [id]);

  return <p>{user?.name ?? '…'}</p>;
}
export {};
