type TabSpec = { id: string; label: string; content: ReactNode };
export function Tabs({ tabs }: { tabs: TabSpec[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  return (
    <div>
      <div role="tablist">{tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === active} onClick={() => setActive(t.id)}>{t.label}</button>
      ))}</div>
      {tabs.map((t) => t.id === active ? <div key={t.id} role="tabpanel">{t.content}</div> : null)}
    </div>
  );
}
