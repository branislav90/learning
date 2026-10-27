import { useEffect, useLayoutEffect, useRef, useState } from "react";

function Child({ n }: { n: number }) {
  console.log("render Child", n);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    console.log("layout setup Child", n, "| dom:", ref.current?.textContent);
    return () => console.log("layout cleanup Child", n);
  }, [n]);
  useEffect(() => {
    console.log("effect setup Child", n);
    return () => console.log("effect cleanup Child", n);
  }, [n]);
  return <div ref={ref}>n={n}</div>;
}

export function App() {
  const [n, setN] = useState(0);
  console.log("render App", n);
  useLayoutEffect(() => {
    console.log("layout setup App", n);
    return () => console.log("layout cleanup App", n);
  }, [n]);
  useEffect(() => {
    console.log("effect setup App", n);
    return () => console.log("effect cleanup App", n);
  }, [n]);
  return (
    <>
      <button onClick={() => setN(n + 1)}>inc</button>
      <Child n={n} />
    </>
  );
}
