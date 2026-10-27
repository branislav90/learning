export {};
function SlowTabs({ tabs }: { tabs: { id: string; label: string; render: () => React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function select(id: string) {
    setPendingId(id); // urgent: show spinner on the clicked tab right away
    startTransition(() => {
      setActive(id);
    });
  }
  // clear pendingId when the transition finishes: derive instead
  const showSpinnerFor = isPending ? pendingId : null;

  return (
    <>
      <div role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => select(t.id)}>
            {t.label} {showSpinnerFor === t.id && <Spinner />}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-busy={isPending}>{tabs.find((t) => t.id === active)!.render()}</div>
    </>
  );
}
