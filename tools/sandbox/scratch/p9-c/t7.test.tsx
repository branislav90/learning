import { Suspense, use, useState, useTransition, useOptimistic, useActionState, useRef, useEffect } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test } from "vitest";
import { deferred } from "./util";
const settle = async (fn: () => void = () => {}, ms = 20) => { await act(async () => { fn(); await new Promise(r => setTimeout(r, ms)); }); };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

test("B1: three clicks, 3 queued actions (30ms each)", async () => {
  const log: string[] = [];
  async function inc(prev: { count: number }, fd: FormData) { await sleep(30); return { count: prev.count + 1 }; }
  function C() {
    const [s, a, p] = useActionState(inc, { count: 0 });
    log.push(`render count=${s.count} pending=${p}`);
    return <form action={a}><input name="by" aria-label="by" defaultValue="1" /><button>Add</button><p>{s.count}</p></form>;
  }
  await act(async () => { render(<C />); }); log.length = 0;
  const i = screen.getByLabelText("by") as HTMLInputElement; i.value = "typed";
  const b = screen.getByRole("button");
  await act(async () => { b.click(); await sleep(5); b.click(); await sleep(5); b.click(); await sleep(150); });
  console.log("B1 log:\n" + log.join("\n"), "\ninput after:", i.value);
});

test("reset applies defaultValue (5.3) and reset happens after failure", async () => {
  type S = { v: string };
  function F({ echo }: { echo: boolean }) {
    const [s, a] = useActionState(async (p: S, fd: FormData) => ({ v: echo ? String(fd.get("e")).toUpperCase() : "" }), { v: "" });
    return <form action={a}><input aria-label="e" name="e" defaultValue={s.v} /><button>go</button></form>;
  }
  for (const echo of [false, true]) {
    const { unmount } = render(<F echo={echo} />);
    const i = screen.getByLabelText("e") as HTMLInputElement; const u = userEvent.setup();
    await u.type(i, "abc"); await act(async () => { screen.getByRole("button").click(); await sleep(20); });
    console.log(`echo=${echo}: value after submit = ${JSON.stringify(i.value)}`); unmount();
  }
});

test("ref callback cleanup semantic", async () => {
  const log: string[] = [];
  function C({ show, v }: { show: boolean; v: number }) {
    return show ? <div ref={(el) => { log.push(`ref(${el ? "el" : "null"}) v=${v}`); return () => log.push(`cleanup v=${v}`); }} /> : null;
  }
  const { rerender, unmount } = render(<C show v={1} />);
  rerender(<C show v={2} />); rerender(<C show={false} v={3} />);
  console.log("ref log:\n" + log.join("\n"));
  const log2: string[] = [];
  function D({ show }: { show: boolean }) { return show ? <div ref={(el) => { log2.push(`ref(${el ? "el" : "null"})`); }} /> : null; }
  const r2 = render(<D show />); r2.rerender(<D show={false} />); console.log("no-cleanup log:", log2.join(","));
});

test("LikeButton C1", async () => {
  function LikeButton({ liked, count, toggle }: { liked: boolean; count: number; toggle: () => Promise<{ liked: boolean; count: number }> }) {
    const [real, setReal] = useState({ liked, count });
    const [optimistic, setOptimistic] = useOptimistic(real, (cur, _: void) => ({ liked: !cur.liked, count: cur.count + (cur.liked ? -1 : 1) }));
    const [error, setError] = useState<string | null>(null);
    const [, startTransition] = useTransition();
    return (<>
      <button aria-pressed={optimistic.liked} onClick={() => startTransition(async () => {
        setError(null); setOptimistic();
        try { const next = await toggle(); startTransition(() => setReal(next)); }
        catch { startTransition(() => setError("Could not update like")); }
      })}>{optimistic.liked ? "L" : "U"} {optimistic.count}</button>{error && <p role="alert">{error}</p>}</>);
  }
  const g1 = deferred<{ liked: boolean; count: number }>();
  const { unmount } = render(<LikeButton liked={false} count={5} toggle={() => g1.promise} />);
  await settle(() => screen.getByRole("button").click()); console.log("like during:", document.body.textContent);
  await settle(() => g1.resolve({ liked: true, count: 6 })); console.log("like success:", document.body.textContent); unmount();
  const g2 = deferred<any>();
  render(<LikeButton liked={false} count={5} toggle={() => g2.promise} />);
  await settle(() => screen.getByRole("button").click()); console.log("like2 during:", document.body.textContent);
  await settle(() => g2.reject(new Error("x"))); console.log("like2 fail:", document.body.textContent);
});

test("conditional use warning (19.3)", async () => {
  const p = deferred<string>(); const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 250));
  let cond = true;
  function C() { if (cond) { use(p.promise); } return <b>done</b>; }
  await act(async () => { render(<Suspense fallback="FB"><C /></Suspense>); });
  cond = false; await act(async () => { p.resolve("x"); await sleep(30); });
  console.error = o; console.log("cond use:", document.body.textContent, errs);
});
