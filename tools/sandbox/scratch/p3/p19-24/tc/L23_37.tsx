export {};
function UserName({ id }: { id: string }) {
  const [name, setName] = useState('');
  useEffect(() => { fetch(`/api/users/${id}`).then(r => r.json()).then(u => setName(u.name)); }, [id]);
  return <span>{name}</span>;
}
