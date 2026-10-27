function Profile({ id }: { id: string }) {
  const [p, setP] = useState<any>(null);
  const [err, setErr] = useState(false);
  useEffect(() => { fetch("/api/p/" + id).then(r => r.json()).then(setP).catch(() => setErr(true)); }, [id]);
  if (err) return <p>Error</p>;
  if (!p) return <p>Loading</p>;
  return <div><img src={p.avatar} /><h1>{p.first} {p.last}</h1><button onClick={() => fetch("/api/p/" + id + "/follow", { method: "POST" })}>Follow</button></div>;
}
export {};
