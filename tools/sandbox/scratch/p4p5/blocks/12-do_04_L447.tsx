// shared/lib/use-disclosure.ts
export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  return useMemo(() => ({
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onToggle: () => setOpen(o => !o),
  }), [open]);
}
export {};
