import { Suspense, use, useState, useTransition, useEffect, useLayoutEffect, startTransition, StrictMode } from "react";
import { render, screen, act } from "@testing-library/react";
import { test } from "vitest";
import { deferred } from "./util";

const out = (t: string, l: string[]) => console.log(`\n### ${t}\n` + l.join("\n"));

function setup(opts: { keyed?: boolean; strict?: boolean } = {}) {
  const log: string[] = [];
  const cache = new Map<number, ReturnType<typeof deferred<string>>>();
  const get = (id: number) => { if (!cache.has(id)) cache.set(id, deferred<string>()); return cache.get(id)!; };
  let setId!: (n: number) => void; let pend = false;
  function Details({ id }: { id: number }) {
    const v = use(get(id).promise);
    log.push(`render Details ${id}=${v}`);
    return <Body id={id} v={v} />;
  }
  function Body({ id, v }: { id: number; v: string }) {
    const [n, setN] = useState(0);
    useLayoutEffect(() => { log.push(`layout-setup ${id}`); return () => { log.push(`layout-cleanup ${id}`); }; });
    useEffect(() => { log.push(`mount-effect ${id}`); return () => log.push(`unmount-effect ${id}`); }, []);
    return <button onClick={() => setN(n + 1)}>{v}:{n}</button>;
  }
  function Fallback() { useEffect(() => { log.push("fallback mounted"); return () => { log.push("fallback unmounted"); }; }, []); return <i>loading</i>; }
  function App() {
    const [id, _setId] = useState(1);
    const [isPending, st] = useTransition();
    log.push(`render App id=${id} pending=${isPending}`);
    setId = (n) => st(() => _setId(n));
    (globalThis as any).plainSet = _setId;
    return <div><span data-testid="p">{String(isPending)}</span>
      <Suspense key={opts.keyed ? id : undefined} fallback={<Fallback />}><Details id={id} /></Suspense></div>;
  }
  return { log, get, App, setId: (n: number) => setId(n), plain: (n: number) => (globalThis as any).plainSet(n) };
}
const settle = async (fn: () => void) => { await act(async () => { fn(); await new Promise(r => setTimeout(r, 20)); }); };
const text = () => document.body.textContent;

test("unkeyed: transition keeps old content; then plain update shows fallback and preserves state", async () => {
  const s = setup();
  await act(async () => { render(<s.App />); });
  out("mount", s.log); s.log.length = 0;
  await settle(() => s.get(1).resolve("A"));
  console.log("after resolve 1:", text());
  await act(async () => { screen.getByRole("button").click(); });
  console.log("after click (n=1):", text()); s.log.length = 0;
  await act(async () => { s.setId(2); });
  console.log("during transition suspended:", text());
  out("transition-suspended log", s.log); s.log.length = 0;
  await settle(() => s.get(2).resolve("B"));
  console.log("after resolve 2:", text()); out("after resolve 2 log", s.log); s.log.length = 0;
  // plain update (urgent) to id 3
  await act(async () => { s.plain(3); });
  console.log("urgent re-suspend:", text(), "| hidden content display:", document.querySelector("button")?.style.display);
  out("urgent log", s.log); s.log.length = 0;
  await settle(() => s.get(3).resolve("C"));
  console.log("after resolve 3:", text()); out("resolve 3 log", s.log);
});

test("unkeyed urgent re-suspend preserves state?", async () => {
  const s = setup();
  await act(async () => { render(<s.App />); });
  await settle(() => s.get(1).resolve("A"));
  await act(async () => { screen.getByRole("button").click(); screen.getByRole("button").click(); });
  console.log("count state:", text());
  s.log.length = 0;
  await act(async () => { s.plain(2); });
  console.log("urgent re-suspend text:", text());
  await settle(() => s.get(2).resolve("B"));
  console.log("after resolve (same Body position, id prop changed) text:", text());
  out("log", s.log);
});

test("keyed boundary + transition", async () => {
  const s = setup({ keyed: true });
  await act(async () => { render(<s.App />); });
  await settle(() => s.get(1).resolve("A"));
  s.log.length = 0;
  await act(async () => { s.setId(2); });
  console.log("keyed transition suspended:", text());
  out("keyed log", s.log); s.log.length = 0;
  await settle(() => s.get(2).resolve("B"));
  console.log("keyed after resolve:", text()); out("keyed resolve log", s.log);
});

test("first mount transition inside new boundary; and siblings pre-warm", async () => {
  const log: string[] = [];
  const d = deferred<string>();
  function A() { log.push("A render"); use(d.promise); return <p>A</p>; }
  function B() { log.push("B render"); return <p>B</p>; }
  render(<div><Suspense fallback={<i>fb</i>}><A /><B /></Suspense></div>);
  out("siblings (initial mount) log", log);
  console.log(text());
});
