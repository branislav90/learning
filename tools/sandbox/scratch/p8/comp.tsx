import React, { useEffect, useState } from "react";
export function Debounced() {
  const [q, setQ] = useState(""); const [r, setR] = useState("");
  useEffect(() => { const t = setTimeout(() => setR(q), 300); return () => clearTimeout(t); }, [q]);
  return <div><input aria-label="q" value={q} onChange={e => setQ(e.target.value)} /><p data-testid="r">{r}</p></div>;
}
