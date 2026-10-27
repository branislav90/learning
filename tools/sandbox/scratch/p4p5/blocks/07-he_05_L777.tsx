export function useAccordion(options: { allowMultiple?: boolean } = {}) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(options.allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  return {
    getTriggerProps: (i: number, props: ComponentProps<"button"> = {}): ComponentProps<"button"> => ({
      type: "button",
      id: `${baseId}-trigger-${i}`,
      "aria-expanded": open.has(i),
      "aria-controls": `${baseId}-panel-${i}`,
      ...props,
      onClick: (e) => { props.onClick?.(e); if (!e.defaultPrevented) toggle(i); },
    }),
    getPanelProps: (i: number, props: ComponentProps<"div"> = {}): ComponentProps<"div"> => ({
      id: `${baseId}-panel-${i}`,
      role: "region",
      "aria-labelledby": `${baseId}-trigger-${i}`,
      hidden: !open.has(i),
      ...props,
    }),
  };
}
export {};
