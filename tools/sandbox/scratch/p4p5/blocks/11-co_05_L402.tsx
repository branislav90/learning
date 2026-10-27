function Tabs({ value, defaultValue = "", onValueChange, children }: TabsProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange, name: "Tabs" });
  const baseId = useId();
  const ctx = useMemo(() => ({ value: current, select: setCurrent, baseId }), [current, setCurrent, baseId]);
  return <TabsContext value={ctx}><div>{children}</div></TabsContext>;
}
export {};
