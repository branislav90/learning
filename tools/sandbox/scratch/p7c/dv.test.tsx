import { test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useDeferredValue, useState, useTransition, memo, Suspense, use } from "react";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test("deferred", async () => {
  const log: string[] = [];
  const Child = memo(({ q }: { q: string }) => { log.push("child:" + q); return <p>{q}</p>; });
  let set!: (s: string) => void;
  function App() { const [q, setQ] = useState("a"); set = setQ; const d = useDeferredValue(q); log.push(`app q=${q} d=${d}`); return <Child q={d} />; }
  render(<App />);
  log.push("--update");
  await act(async () => { set("ab"); });
  console.log(log.join("\n"));
});
test("initialValue", async () => {
  const log: string[] = [];
  function App() { const d = useDeferredValue("real", ""); log.push("d=" + JSON.stringify(d)); return <p>{d}</p>; }
  render(<App />);
  console.log(log.join("\n"));
});
test("inside transition", async () => {
  const log: string[] = [];
  let go!: () => void;
  function App() { const [q, setQ] = useState("a"); const [, st] = useTransition(); go = () => st(() => setQ("b")); const d = useDeferredValue(q); log.push(`q=${q} d=${d}`); return null; }
  render(<App />);
  log.push("--");
  await act(async () => { go(); });
  console.log(log.join("\n"));
});
