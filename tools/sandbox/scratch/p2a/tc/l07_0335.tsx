import { useMemo, useState } from "react";

type RawRow = { name: string };
type Row = { id: string; name: string };

function withIds(rows: RawRow[]): Row[] {
  return rows.map((r) => ({ id: crypto.randomUUID(), name: r.name }));
}

export function Names({ initial }: { initial: RawRow[] }) {
  const [rows] = useState<Row[]>(() => withIds(initial));   // ids assigned ONCE at ingestion
  const [filter, setFilter] = useState("");
  const visible = useMemo(() => rows.filter((r) => r.name.includes(filter)), [rows, filter]);
  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {visible.map((r) => (
          <li key={r.id}><input defaultValue={r.name} /></li>
        ))}
      </ul>
    </>
  );
}
