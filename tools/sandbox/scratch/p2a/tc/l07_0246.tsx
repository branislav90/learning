import { useState } from "react";

function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>clicked {n}</button>;
}

export function Demo() {
  const [version, setVersion] = useState(0);
  return (
    <>
      <Counter key={version} />
      <button onClick={() => setVersion((v) => v + 1)}>reset counter</button>
    </>
  );
}
