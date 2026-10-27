import { useState } from "react";

function Row({ n }: { n: number }) { return <li>{n}</li>; }

export function List({ size }: { size: number }) {
  const [tick, setTick] = useState(0);
  const t0 = performance.now();
  const rows = Array.from({ length: size }, (_, i) => <Row key={i} n={i} />);
  // The commit happens after this function returns; measure around setTick with the Profiler instead.
  console.log("element creation ms:", (performance.now() - t0).toFixed(2));
  return (
    <>
      <button onClick={() => setTick((t) => t + 1)}>re-render {tick}</button>
      <ul>{rows}</ul>
    </>
  );
}
