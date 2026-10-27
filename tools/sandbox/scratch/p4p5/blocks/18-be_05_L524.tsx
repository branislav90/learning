function UserMenu({ items }: { items: MenuItem[] }) {
  const d = useDisclosure();
  const root = useRef<HTMLDivElement>(null);
  useDismiss(d.open, d.close, useMemo(() => [root], []));      // useMemo as a stability hint only
  return (
    <div ref={root} className="relative inline-block">
      <button {...d.getTriggerProps({ className: 'px-3 py-2 rounded bg-blue-600 text-white', 'aria-haspopup': 'menu' })}>Account ▾</button>
      <ul {...d.getPanelProps({ role: 'menu', className: 'absolute right-0 mt-1 w-48 bg-white shadow rounded' })}>
        {items.map((i) => (
          <li key={i.id} role="none">
            <button role="menuitem" className="block w-full px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => { i.onSelect(); d.close(); }}>{i.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export {};
