type TabsProps = {
  /** @deprecated Use `onValueChange`. Receives the tab index. Removed in v3. */
  onChange?: (index: number) => void;
  onValueChange?: (id: string) => void;
  tabs: readonly { id: string; label: string }[];
};

export function Tabs({ onChange, onValueChange, tabs }: TabsProps) {
  function select(i: number) {
    onValueChange?.(tabs[i].id);
    if (onChange) {
      warnOnce('Tabs.onChange', '`onChange` is deprecated; use `onValueChange`.');
      onChange(i);
    }
  }
  return (
    <div role="tablist">
      {tabs.map((t, i) => (
        <button key={t.id} role="tab" onClick={() => select(i)}>{t.label}</button>
      ))}
    </div>
  );
}
