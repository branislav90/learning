import { Suspense, use, useState, useTransition, useEffect, useDeferredValue, useOptimistic, useActionState, startTransition, StrictMode, Activity, useEffectEvent, useRef } from "react";
import { useFormStatus } from "react-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test } from "vitest";
import { deferred } from "./util";
const out = (t: string, l: string[]) => console.log(`\n### ${t}\n` + l.join("\n"));
const settle = async (fn: () => void = () => {}) => { await act(async () => { fn(); await new Promise(r => setTimeout(r, 20)); }); };
const text = () => document.body.textContent;

test("siblings prewarm", async () => {
  const log: string[] = []; const d = deferred<string>();
  function A() { log.push("A render"); use(d.promise); return <p>A</p>; }
  function B() { log.push("B render"); return <p>B</p>; }
  await act(async () => { render(<div><Suspense fallback={<i>fb</i>}><A /><B /></Suspense></div>); });
  await settle();
  out("prewarm (after settle)", log); console.log(text());
});

test("useTransition render sequence", async () => {
  const log: string[] = [];
  let go!: () => void;
  function Slow({ n }: { n: number }) { log.push(`Slow render n=${n}`); return <b>{n}</b>; }
  function App() {
    const [n, setN] = useState(0); const [p, st] = useTransition();
    log.push(`App render n=${n} pending=${p}`);
    go = () => st(() => setN(n + 1));
    return <div><Slow n={n} /></div>;
  }
  await act(async () => { render(<App />); }); log.length = 0;
  await settle(() => go()); out("sync transition", log);
  log.length = 0;
  // async transition
  let goA!: () => void; const d = deferred<void>();
  function App2() {
    const [n, setN] = useState(0); const [p, st] = useTransition();
    log.push(`App2 render n=${n} pending=${p}`);
    goA = () => st(async () => { await d.promise; setN(x => x + 1); });
    return <div>{n}</div>;
  }
  await act(async () => { render(<App2 />); }); log.length = 0;
  await settle(() => goA()); log.push("-- resolve"); await settle(() => d.resolve());
  out("async transition: setN after await WITHOUT re-wrap", log);
  console.log(text());
});

test("useDeferredValue counts", async () => {
  for (const mode of ["none", "init", "initEmpty"] as const) {
    for (const strict of [false, true]) {
      const log: string[] = []; let setV!: (s: string) => void;
      function Child({ v }: { v: string }) { log.push(`Child ${v}`); return <b>{v}</b>; }
      function App() {
        const [v, _s] = useState("a"); setV = _s;
        const dv = mode === "none" ? useDeferredValue(v) : mode === "init" ? useDeferredValue(v, "INIT") : useDeferredValue(v, "");
        log.push(`App v=${v} dv=${dv}`);
        return <Child v={dv} />;
      }
      const ui = strict ? <StrictMode><App /></StrictMode> : <App />;
      const { unmount } = render(ui); await settle();
      const mountLog = log.slice(); log.length = 0;
      await settle(() => setV("b"));
      out(`deferred mode=${mode} strict=${strict}\nMOUNT:\n${mountLog.join("\n")}\nUPDATE:`, log);
      unmount();
    }
  }
});

test("deferred suspends -> old content stays", async () => {
  const log: string[] = []; const cache = new Map<string, ReturnType<typeof deferred<string>>>();
  const get = (k: string) => { if (!cache.has(k)) cache.set(k, deferred<string>()); return cache.get(k)!; };
  let setQ!: (s: string) => void;
  function R({ q }: { q: string }) { const v = use(get(q).promise); log.push(`R ${q}`); return <b>{v}</b>; }
  function App() { const [q, s] = useState("a"); setQ = s; const dq = useDeferredValue(q); return <div><Suspense fallback="FB"><R q={dq} /></Suspense></div>; }
  await act(async () => { render(<App />); }); await settle(() => get("a").resolve("resA"));
  console.log("initial:", text());
  await settle(() => setQ("b")); console.log("deferred suspended:", text());
  await settle(() => get("b").resolve("resB")); console.log("resolved:", text()); out("log", log);
});

test("useOptimistic revert", async () => {
  const log: string[] = []; let run!: (ok: boolean) => void; const gates: any[] = [];
  function App() {
    const [real, setReal] = useState(["A"]);
    const [opt, add] = useOptimistic(real, (cur: string[], t: string) => [...cur, t + "*"]);
    const [p, st] = useTransition();
    log.push(`render real=${real} opt=${opt} pending=${p}`);
    run = (writeReal) => st(async () => { add("B"); const g = deferred<void>(); gates.push(g); await g.promise; if (writeReal) startTransition(() => setReal(r => [...r, "B"])); });
    return <div>{opt.join(",")}</div>;
  }
  await act(async () => { render(<App />); }); log.length = 0;
  await settle(() => run(true)); console.log("during:", text());
  await settle(() => gates[0].resolve()); console.log("after success (real updated, re-wrapped):", text());
  out("success log", log); log.length = 0;
  await settle(() => run(false)); console.log("during2:", text());
  await settle(() => gates[1].resolve()); console.log("after no-real-update:", text()); out("fail log", log);
});

test("useOptimistic outside transition warns", async () => {
  const errs: string[] = []; const orig = console.error; console.error = (...a: any[]) => { errs.push(String(a[0]).slice(0, 160)); };
  let go!: () => void;
  function App() { const [o, set] = useOptimistic(false); go = () => set(true); return <div>{String(o)}</div>; }
  await act(async () => { render(<App />); }); await settle(() => go());
  console.error = orig; console.log("warns:", errs, "text:", text());
});
