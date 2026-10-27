function EditUser({ id }: { id: string }) {
  const user = useUserQuery(id);          // server-state hook; returns { name: string } (already loaded)
  const [name, setName] = useState(user.name);
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
export {};
