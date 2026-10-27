export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<"none" | "refund" | "export">("none");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { fetch("/api/me").then(r => r.json()).then(setUser); }, []);
  useEffect(() => { fetch(`/api/orders?filter=${filter}`).then(r => r.json()).then(setOrders); }, [filter]);
  // ... 40 lines: refund handler (fetch + validation + toast), CSV export, role checks
  // ... 150 lines of JSX: header, filter bar, table, two modals, toast
}
export {};
