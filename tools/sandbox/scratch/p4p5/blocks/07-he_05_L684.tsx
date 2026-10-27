function Accordion({ items }: { items: { title: string; body: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border rounded divide-y">
      {items.map((it, i) => (
        <div key={i}>
          <div className="p-3 cursor-pointer font-semibold" onClick={() => setOpen(open === i ? null : i)}>{it.title}</div>
          {open === i && <div className="p-3">{it.body}</div>}
        </div>
      ))}
    </div>
  );
}
export {};
