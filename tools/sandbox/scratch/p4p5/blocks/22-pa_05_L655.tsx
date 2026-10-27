const DisclosureCtx = createContext<{ open: boolean; toggle: () => void; id: string } | null>(null);
function useDisclosure(part: string) {
  const c = use(DisclosureCtx);
  if (!c) throw new Error(`<${part}> must be used within <Disclosure>`);
  return c;
}
export function Disclosure({ open, defaultOpen = false, onOpenChange, children }:
  { open?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean) => void; children: ReactNode }) {
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const id = useId();
  return <DisclosureCtx value={{ open: isOpen, toggle: () => setOpen(!isOpen), id }}>{children}</DisclosureCtx>;
}
export function DisclosureButton({ onClick, ...rest }: ComponentProps<'button'>) {
  const { open, toggle, id } = useDisclosure('DisclosureButton');
  return <button type="button" aria-expanded={open} aria-controls={`${id}-panel`}
    {...rest} onClick={composeEventHandlers(onClick, toggle)} />;
}
export function DisclosurePanel(props: ComponentProps<'div'>) {
  const { open, id } = useDisclosure('DisclosurePanel');
  return <div id={`${id}-panel`} hidden={!open} {...props} />;
}
export {};
