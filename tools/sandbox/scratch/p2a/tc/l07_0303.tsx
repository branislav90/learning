import { useState } from "react";

type Row = { name: string };

export function Names({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState("");
  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {rows
          .filter((r) => r.name.includes(filter))
          .map((r) => (
            <li key={Math.random()}>               {/* ❌ new identity every render */}
              <input defaultValue={r.name} />
            </li>
          ))}
      </ul>
    </>
  );
}
