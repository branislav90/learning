type Invoice = { id: string; total: number; paid: boolean };
type Services = {
  invoices: { list(): Promise<Invoice[]>; markPaid(id: string): Promise<void> };
};

const defaults: Services = {
  invoices: {
    list: async () => (await fetch("/api/invoices")).json(),
    markPaid: async (id) => { const r = await fetch(`/api/invoices/${id}/pay`, { method: "POST" }); if (!r.ok) throw new Error(String(r.status)); },
  },
};

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ overrides, children }: { overrides?: Partial<Services>; children: React.ReactNode }) {
  const value = useMemo(() => ({ ...defaults, ...overrides }), [overrides]);
  return <ServicesContext value={value}>{children}</ServicesContext>;
}
export function useServices(): Services {
  const s = use(ServicesContext);
  if (!s) throw new Error("useServices must be used inside <ServicesProvider>");
  return s;
}

type Command = { type: "markPaid"; id: string };
type State = { invoices: Invoice[]; status: "loading" | "ready" | "error" };
type Action =
  | { type: "loaded"; invoices: Invoice[] }
  | { type: "failed" }
  | { type: "apply"; command: Command }
  | { type: "rollback"; command: Command };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "loaded": return { status: "ready", invoices: a.invoices };
    case "failed": return { ...s, status: "error" };
    case "apply": return { ...s, invoices: s.invoices.map((i) => i.id === a.command.id ? { ...i, paid: true } : i) };
    case "rollback": return { ...s, invoices: s.invoices.map((i) => i.id === a.command.id ? { ...i, paid: false } : i) };
  }
}

export function useInvoices() {
  const { invoices: api } = useServices();
  const [state, dispatch] = useReducer(reducer, { invoices: [], status: "loading" });

  useEffect(() => {
    let ignore = false;
    api.list().then(
      (invoices) => { if (!ignore) dispatch({ type: "loaded", invoices }); },
      () => { if (!ignore) dispatch({ type: "failed" }); },
    );
    return () => { ignore = true; };
  }, [api]);

  const markPaid = useCallback(async (id: string) => {
    const command: Command = { type: "markPaid", id };
    dispatch({ type: "apply", command });
    try { await api.markPaid(id); }
    catch { dispatch({ type: "rollback", command }); }
  }, [api]);

  return { invoices: state.invoices, status: state.status, markPaid };
}
export {};
