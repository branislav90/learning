import { useState } from "react";

function Counter({ label }: { label: string }) {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{label}: {n}</button>;
}

export function Parent({ showA }: { showA: boolean }) {
  const [flag, setFlag] = useState(false);
  return (
    <>
      <button onClick={() => setFlag(!flag)}>flag {String(flag)}</button>
      {/* ❌ direct call: Counter's hooks become Parent's hooks */}
      {showA ? Counter({ label: "A" }) : null}
      {/* ✅ element: Counter gets its own fiber and hooks */}
      <Counter label="B" />
    </>
  );
}
