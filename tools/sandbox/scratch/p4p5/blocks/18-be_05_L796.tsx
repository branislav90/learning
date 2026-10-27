function useAccordion<K extends string>(keys: readonly K[], opts: { type: 'single' | 'multiple'; value?: K[]; defaultValue?: K[]; onValueChange?: (v: K[]) => void }) {
  const [value, setValue] = useControllableState<K[]>({ value: opts.value, defaultValue: opts.defaultValue ?? [], onChange: opts.onValueChange });
  const base = useId();
  const toggle = (k: K) =>
    setValue(
      value.includes(k)
        ? value.filter((x) => x !== k)
        : opts.type === 'single' ? [k] : [...value, k],
    );
  const getTriggerProps = (k: K, p: ButtonHTMLAttributes<HTMLButtonElement> = {}) => ({
    ...p, id: `${base}-t-${k}`, type: 'button' as const,
    'aria-expanded': value.includes(k), 'aria-controls': `${base}-p-${k}`,
    'data-state': value.includes(k) ? 'open' : 'closed',
    onClick: composeHandlers(p.onClick, () => toggle(k)),
  });
  const getPanelProps = (k: K, p: HTMLAttributes<HTMLElement> = {}) => ({
    ...p, id: `${base}-p-${k}`, role: 'region' as const, 'aria-labelledby': `${base}-t-${k}`, hidden: !value.includes(k),
  });
  return { value, getTriggerProps, getPanelProps };
}
export {};
