import { Suspense, use, useState, useTransition, Component } from "react";
import { createRoot } from "react-dom/client";
import { render, screen, act } from "@testing-library/react";
import { test } from "vitest";
import { deferred } from "./util";
const out = (t: string, l: string[]) => console.log(`\n### ${t}\n` + l.join("\n"));
const settle = async (fn: () => void = () => {}, ms = 20) => { await act(async () => { fn(); await new Promise(r => setTimeout(r, ms)); }); };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

test("unstable promise, real root without act env", async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
  const errs: string[] = []; const orig = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 300));
  let renders = 0;
  function Bad() { renders++; const v = use(new Promise<string>(r => setTimeout(() => r("x"), 10))); return <p>{v}</p>; }
  const el = document.createElement("div"); document.body.appendChild(el);
  const root = createRoot(el); root.render(<Suspense fallback="FB"><Bad /></Suspense>);
  await sleep(500);
  console.error = orig;
  console.log("UNSTABLE: renders =", renders, "dom =", el.textContent, "errs:", errs);
  root.unmount(); (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

test("unstable promise on UPDATE (already shown content)", async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
  let renders = 0; let go!: () => void;
  function Bad({ n }: { n: number }) { renders++; const v = use(new Promise<string>(r => setTimeout(() => r("x" + n), 10))); return <p>{v}</p>; }
  function App() { const [n, setN] = useState(0); go = () => setN(1); return n === 0 ? <p>idle</p> : <Suspense fallback="FB"><Bad n={n} /></Suspense>; }
  const el = document.createElement("div"); document.body.appendChild(el);
  const root = createRoot(el); root.render(<App />); await sleep(20); go(); await sleep(500);
  console.log("UNSTABLE (post-mount): renders =", renders, "dom =", el.textContent);
  root.unmount(); (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

test("two independent async transitions (19.3)", async () => {
  const log: string[] = []; const gA = deferred<void>(), gB = deferred<void>();
  let goA!: () => void, goB!: () => void;
  function App() {
    const [a, setA] = useState(0); const [b, setB] = useState(0);
    const [pA, stA] = useTransition(); const [pB, stB] = useTransition();
    log.push(`render a=${a} b=${b} pA=${pA} pB=${pB}`);
    goA = () => stA(async () => { await gA.promise; stA(() => setA(1)); });
    goB = () => stB(async () => { await gB.promise; stB(() => setB(1)); });
    return <div>{a}{b}</div>;
  }
  await act(async () => { render(<App />); }); log.length = 0;
  await settle(() => goA()); await settle(() => goB());
  log.push("-- resolve B (fast) first"); await settle(() => gB.resolve());
  console.log("after B resolved:", document.body.textContent);
  log.push("-- resolve A"); await settle(() => gA.resolve());
  console.log("after A resolved:", document.body.textContent);
  out("independent transitions log", log);
});

test("two async transitions via SAME useTransition", async () => {
  const log: string[] = []; const gA = deferred<void>(), gB = deferred<void>();
  let go!: (w: "a" | "b") => void;
  function App() {
    const [a, setA] = useState(0); const [b, setB] = useState(0); const [p, st] = useTransition();
    log.push(`render a=${a} b=${b} p=${p}`);
    go = (w) => st(async () => { await (w === "a" ? gA : gB).promise; st(() => (w === "a" ? setA(1) : setB(1))); });
    return <div>{a}{b}</div>;
  }
  await act(async () => { render(<App />); }); log.length = 0;
  await settle(() => go("a")); await settle(() => go("b"));
  log.push("-- resolve B first"); await settle(() => gB.resolve()); console.log("after B:", document.body.textContent);
  log.push("-- resolve A"); await settle(() => gA.resolve()); console.log("after A:", document.body.textContent);
  out("same-hook log", log);
});

test("async transition throws -> error boundary", async () => {
  class EB extends Component<{ children: any }, { e: string }> { state = { e: "" }; static getDerivedStateFromError(e: Error) { return { e: e.message }; } render() { return this.state.e ? <p>caught:{this.state.e}</p> : this.props.children; } }
  let go!: () => void;
  function App() { const [p, st] = useTransition(); go = () => st(async () => { await sleep(5); throw new Error("nope"); }); return <p>{String(p)}</p>; }
  const errs: string[] = []; const orig = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 80));
  await act(async () => { render(<EB><App /></EB>); }); await settle(() => go(), 50);
  console.error = orig; console.log("async throw:", document.body.textContent);
});
