function AdvancedSection({ open, onOpenChange, children }: { open: boolean; onOpenChange(o: boolean): void; children: React.ReactNode }) {
  const d = useDisclosure({ open, onOpenChange });
  return (
    <section className="rounded border p-4">
      <header className="flex items-center justify-between">
        <h3>Advanced</h3>
        <button {...d.getTriggerProps({ className: 'text-sm underline' })}>{d.open ? 'Hide' : 'Show'}</button>
      </header>
      <div {...d.getPanelProps({ className: 'mt-3' })}>{children}</div>
    </section>
  );
}
export {};
