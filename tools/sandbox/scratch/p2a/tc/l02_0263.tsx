import { useRef, useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  function handleClick() {
    setN(n + 1);
    console.log("DOM text after setN:", ref.current?.textContent);
    console.log("n in closure:", n);
  }

  return (
    <>
      <span ref={ref}>{n}</span>
      <button onClick={handleClick}>+</button>
    </>
  );
}
