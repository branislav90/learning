function User({ id }: { id: string }) {
  useEffect(() => { fetch(`/api/users/${id}`); }, [id]);
  return null;
}
export {};
