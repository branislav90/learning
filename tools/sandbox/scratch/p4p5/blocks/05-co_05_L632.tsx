const TabsCtx = createContext<{ selected: string; select: (id: string) => void } | null>(null);

function SimpleTabs({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState("");
  const value = useMemo(() => ({ selected, select: setSelected }), [selected]);
  return <TabsCtx value={value}><div role="tablist">{children}</div></TabsCtx>;
}

function Tab({ id, label }: { id: string; label: string }) {
  const ctx = use(TabsCtx);
  if (!ctx) throw new Error("<Tab> must be inside <SimpleTabs>");
  return (
    <button role="tab" aria-selected={ctx.selected === id} onClick={() => ctx.select(id)}>
      {label}
    </button>
  );
}

function BillingTab() { return <Tab id="b" label="Billing" />; }   // now works
export {};
