import { Suspense, use, useState, useTransition, useRef, StrictMode, useSyncExternalStore } from "react";
import { render, screen, act } from "@testing-library/react";
import { test } from "vitest";
import { deferred } from "./util";
const settle = async (fn: () => void = () => {}, ms = 20) => { await act(async () => { fn(); await new Promise(r => setTimeout(r, ms)); }); };

test("independent sync transitions, one suspends", async () => {
  const slow = deferred<string>(); const log: string[] = []; let goA!: () => void, goB!: () => void;
  function Slow({ on }: { on: boolean }) { if (on) use(slow.promise); return <b>slow:{String(on)}</b>; }
  function App() {
    const [a, setA] = useState(false); const [b, setB] = useState(0);
    const [pA, stA] = useTransition(); const [pB, stB] = useTransition();
    goA = () => stA(() => setA(true)); goB = () => stB(() => setB(x => x + 1));
    log.push(`render a=${a} b=${b} pA=${pA} pB=${pB}`);
    return <div><Suspense fallback="FB"><Slow on={a} /></Suspense><i>b={b}</i></div>;
  }
  await act(async () => { render(<App />); }); log.length = 0;
  await settle(() => goA()); await settle(() => goB());
  console.log("after both started:", document.body.textContent);
  console.log(log.join("\n"));
});

test("ref in render under StrictMode (B2)", async () => {
  function Counter() { const [n, setN] = useState(0); const ref = useRef(0); ref.current += 1; return <button onClick={() => setN(n + 1)}>{n} / {ref.current}</button>; }
  render(<StrictMode><Counter /></StrictMode>); await settle(); console.log("strict mount:", document.body.textContent);
  await settle(() => screen.getByRole("button").click()); console.log("strict after click:", document.body.textContent);
});

test("getSnapshot new object each call (B3)", async () => {
  const store = { state: { x: 1 }, subscribe: (l: () => void) => () => {} };
  function C() { const s = useSyncExternalStore(store.subscribe, () => ({ ...store.state })); return <p>{s.x}</p>; }
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 150));
  let thrown = ""; try { render(<C />); } catch (e: any) { thrown = e.message; }
  console.error = o; console.log("B3 thrown:", thrown.slice(0, 200), "| console.error:", errs.slice(0, 3));
});
