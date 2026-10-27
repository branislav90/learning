import { memo, useDeferredValue, useState } from "react";
import { createRoot } from "react-dom/client";

function SlowRow({ text }: { text: string }) {
  // Deliberately burn ~1 ms per row. Do this ONLY in a demo.
  const end = performance.now() + 1;
  while (performance.now() < end) {}
  return <li>{text}</li>;
}

const SlowList = memo(function SlowList({ text }: { text: string }) {
  const rows = Array.from({ length: 250 }, (_, i) => (
    <SlowRow key={i} text={`${text} #${i}`} />
  ));
  return <ul>{rows}</ul>;
});

function App() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Search" />
      <SlowList text={deferredText} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
