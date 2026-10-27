function ProfileForm({ id }: { id: string }) {
  const { data: user } = useUserQuery(id);          // cached server state
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const save = useSaveUser();
  return (
    <form onSubmit={e => { e.preventDefault(); save.mutate({ id, ...form }); }}>
      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
    </form>
  );
}
export {};
