import { useEffect, useLayoutEffect, useState } from "react";

function log(s: string) { console.log(s); }

function Child({ label }: { label: string }) {
  log(`render child(${label})`);
  useLayoutEffect(() => {
    log(`layout setup child(${label})`);
    return () => log(`layout cleanup child(${label})`);
  });
  useEffect(() => {
    log(`passive setup child(${label})`);
    return () => log(`passive cleanup child(${label})`);
  });
  return <p>{label}</p>;
}

export function Parent() {
  const [n, setN] = useState(0);
  log(`render parent(${n})`);
  useLayoutEffect(() => {
    log(`layout setup parent(${n})`);
    return () => log(`layout cleanup parent(${n})`);
  });
  useEffect(() => {
    log(`passive setup parent(${n})`);
    return () => log(`passive cleanup parent(${n})`);
  });
  return (
    <>
      <button onClick={() => setN(n + 1)}>+</button>
      <Child label={`n=${n}`} />
    </>
  );
}
