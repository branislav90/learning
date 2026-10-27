import { useEffect, useRef, useState } from "react";

export function Banner() {
  const [msg, setMsg] = useState("Hello");
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // A third-party "enhancer" or a developer mutates the node React manages:
    ref.current!.textContent = "Hello (enhanced)";
  }, []);

  return (
    <>
      <p ref={ref}>{msg}</p>
      <button onClick={() => setMsg("Goodbye")}>change</button>
    </>
  );
}
