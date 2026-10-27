type DisclosureRenderProps = { open: boolean; toggle: () => void; close: () => void };

export function Disclosure({ defaultOpen = false, children }: {
  defaultOpen?: boolean;
  children: (p: DisclosureRenderProps) => ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);
  return <>{children({ open, toggle, close })}</>;
}
export {};
