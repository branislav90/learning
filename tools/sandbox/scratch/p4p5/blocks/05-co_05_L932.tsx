const MenuCtx = createContext<{ close: () => void } | null>(null);

export function Menu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <MenuCtx value={{ close }}>
      <button aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Actions</button>
      {open && <div role="menu">{children}</div>}
    </MenuCtx>
  );
}
export function MenuItem({ onSelect, danger, children }: { onSelect: () => void; danger?: boolean; children: ReactNode }) {
  const m = use(MenuCtx)!;
  return (
    <button role="menuitem" data-danger={danger || undefined} onClick={() => { onSelect(); m.close(); }}>
      {children}
    </button>
  );
}

// Preset preserving the old API:
type Item = { label: string; onSelect: () => void; danger?: boolean };
export function SimpleMenu({ items }: { items: Item[] }) {
  return (
    <Menu>
      {items.map((i) => <MenuItem key={i.label} onSelect={i.onSelect} danger={i.danger}>{i.label}</MenuItem>)}
    </Menu>
  );
}
export {};
