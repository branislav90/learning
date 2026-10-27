import { Suspense, use } from "react";
import { render, act } from "@testing-library/react";
import { test } from "vitest";
import { deferred } from "./util";
test("no boundary", async () => {
  const d = deferred<string>();
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 200));
  function C() { return <p>{use(d.promise)}</p>; }
  let err = "";
  try { await act(async () => { render(<C />); }); } catch (e: any) { err = e.message; }
  console.error = o; console.log("NOBOUNDARY err:", err, errs);
  await act(async () => { d.resolve("done"); await new Promise(r => setTimeout(r, 20)); }); console.log("after resolve:", document.body.textContent);
});
test("ordering reveal timings", async () => {
  const t0 = Date.now(); const seen: Record<string, number> = {};
  const mk = (ms: number) => new Promise<string>(r => setTimeout(() => r("v"), ms));
  const a = mk(60), b = mk(20), c = mk(90);
  function S({ n, p }: { n: string; p: Promise<string> }) { use(p); seen[n] ??= Date.now() - t0; return <p>{n}</p>; }
  function Eff({ n }: { n: string }) { return <i data-n={n} />; }
  await act(async () => { render(<Suspense fallback="sk1"><S n="Summary" p={a} /><Suspense fallback="sk2"><S n="Timeline" p={b} /><Suspense fallback="sk3"><S n="Recs" p={c} /></Suspense></Suspense></Suspense>); });
  const snaps: string[] = [];
  for (let i = 0; i < 12; i++) { await act(async () => { await new Promise(r => setTimeout(r, 10)); }); snaps.push(`${Date.now() - t0}ms: ${document.body.textContent}`); }
  console.log(snaps.join("\n"));
});
