function A({ items }: { items: Item[] }) { const [open, setOpen] = useState(false); /* renders a collapsible list */ }
function B() { const { data } = useQuery(["items"], fetchItems); return <A items={data ?? []} />; }
function C({ id }: { id: string }) { const nav = useNavigate(); return <button onClick={() => nav(`/i/${id}`)}>Open</button>; }
export {};
