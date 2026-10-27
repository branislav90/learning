import { createRoot } from "react-dom/client";
import { useState } from "react";

function burn(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}

function Heavy({ n }: { n: number }) {
  burn(300);                       // a single 300 ms component
  return <p>n = {n}</p>;
}

function App() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN((x) => x + 1)}>increment</button>
      <Heavy n={n} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
export {};
