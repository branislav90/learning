// INCORRECT (as architecture): behaviour duplicated per skin
function UserMenu({ items }: { items: { id: string; label: string; onSelect(): void }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (!ref.current?.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);   // subscribed even when closed
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        className="px-3 py-2 rounded bg-blue-600 text-white"
        onClick={() => setOpen(!open)}                               // stale-closure-prone toggle
      >
        Account ▾
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-48 bg-white shadow rounded">
          {items.map((i) => (
            <li key={i.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { i.onSelect(); setOpen(false); }}>
              {i.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export {};
