// Before
function Rename({ id }: { id: string }) {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true); setError(null);
    try { await rename(id, name); } catch (err) { setError(String(err)); }
    finally { setPending(false); }
  }
  return (
    <form onSubmit={onSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button disabled={pending}>Save</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
export {};
