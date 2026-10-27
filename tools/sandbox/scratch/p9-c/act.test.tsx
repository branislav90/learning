import { Suspense, use, useState, useTransition, useEffect, useOptimistic, useActionState, startTransition, StrictMode, Activity, useEffectEvent, createContext } from "react";
import { useFormStatus } from "react-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test } from "vitest";
import { deferred } from "./util";
const out = (t: string, l: string[]) => console.log(`\n### ${t}\n` + l.join("\n"));
const settle = async (fn: () => void = () => {}, ms = 20) => { await act(async () => { fn(); await new Promise(r => setTimeout(r, ms)); }); };
const text = () => document.body.textContent;

test("useActionState counter queue (lesson 5.1)", async () => {
  const log: string[] = [];
  type State = { count: number; error?: string };
  const gates: any[] = [];
  async function increment(prev: State, fd: FormData): Promise<State> {
    const by = Number(fd.get("by") ?? 1); log.push(`action start prev=${prev.count} by=${by}`);
    const g = deferred<void>(); gates.push(g); await g.promise; log.push("action end"); return { count: prev.count + by };
  }
  function Counter() {
    const [state, formAction, isPending] = useActionState(increment, { count: 0 });
    log.push(`render count=${state.count} pending=${isPending}`);
    return <form action={formAction}><input name="by" defaultValue="1" aria-label="by" /><button>Add</button><p data-testid="c">{state.count}{isPending ? " ..." : ""}</p></form>;
  }
  await act(async () => { render(<Counter />); }); log.length = 0;
  const input = screen.getByLabelText("by") as HTMLInputElement; input.value = "5";
  const btn = screen.getByRole("button");
  await settle(() => btn.click()); console.log("after click1:", text(), "input:", input.value);
  await settle(() => btn.click()); console.log("after click2 (queued):", text(), "gates:", gates.length);
  await settle(() => gates[0].resolve()); console.log("after resolve1:", text(), "gates:", gates.length, "input:", input.value);
  await settle(() => gates[1].resolve()); console.log("after resolve2:", text(), "input:", input.value);
  out("log", log);
});

test("useFormStatus in same component vs child", async () => {
  const log: string[] = []; const g = deferred<void>();
  function Child() { const s = useFormStatus(); log.push(`child pending=${s.pending} method=${s.method} actionType=${typeof s.action} data=${s.data?.get("x")}`); return <button>go</button>; }
  function Parent() { const s = useFormStatus(); log.push(`parent pending=${s.pending}`); return <form action={async () => { await g.promise; }}><input name="x" defaultValue="v" /><Child /></form>; }
  await act(async () => { render(<Parent />); }); log.length = 0;
  await settle(() => screen.getByRole("button").click()); await settle(() => g.resolve()); out("formStatus", log);
});

test("form reset + defaultValue (lesson 5.3)", async () => {
  type FormState = { ok: boolean; values: { email: string }; errors: { email?: string } };
  async function signup(prev: FormState, fd: FormData): Promise<FormState> {
    const email = String(fd.get("email") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, values: { email }, errors: { email: "Invalid email" } };
    return { ok: true, values: { email: "" }, errors: {} };
  }
  function Signup() {
    const [state, action] = useActionState(signup, { ok: false, values: { email: "" }, errors: {} } as FormState);
    return <form action={action}><input aria-label="email" name="email" defaultValue={state.values.email} /><p>{state.errors.email}</p><button>s</button></form>;
  }
  await act(async () => { render(<Signup />); });
  const i = screen.getByLabelText("email") as HTMLInputElement;
  const user = userEvent.setup();
  await user.type(i, "bad"); await act(async () => { screen.getByRole("button").click(); await new Promise(r => setTimeout(r, 20)); });
  console.log("after invalid submit: input value =", JSON.stringify(i.value), text());
  await user.clear(i); await user.type(i, "a@b.co"); await act(async () => { screen.getByRole("button").click(); await new Promise(r => setTimeout(r, 20)); });
  console.log("after valid submit: input value =", JSON.stringify(i.value));
});

test("useOptimistic + useActionState (lesson 4.1 & 5.2 patterns)", async () => {
  type Todo = { id: string; title: string; pending?: boolean };
  const gates: any[] = [];
  const log: string[] = [];
  function TodoList() {
    const [state, dispatch, isPending] = useActionState(async (prev: { todos: Todo[]; error?: string }, title: string) => {
      const g = deferred<void>(); gates.push(g); await g.promise;
      if (title === "fail") return { ...prev, error: "Could not add todo" };
      return { todos: [...prev.todos, { id: title, title }] };
    }, { todos: [{ id: "A", title: "A" }] } as { todos: Todo[]; error?: string });
    const [opt, addOpt] = useOptimistic(state.todos, (cur: Todo[], title: string) => [...cur, { id: "tmp" + title, title, pending: true }]);
    log.push(`render real=${state.todos.map(t => t.title)} opt=${opt.map(t => t.title + (t.pending ? "*" : ""))} pending=${isPending}`);
    function submit(fd: FormData) { const title = String(fd.get("title")); addOpt(title); startTransition(() => dispatch(title)); }
    return <form action={submit}><ul>{opt.map(t => <li key={t.id}>{t.title}{t.pending ? "*" : ""}</li>)}</ul><input name="title" aria-label="t" /><button disabled={isPending}>Add</button><p>{state.error}</p></form>;
  }
  await act(async () => { render(<TodoList />); }); log.length = 0;
  const t = screen.getByLabelText("t") as HTMLInputElement;
  t.value = "B"; await settle(() => screen.getByRole("button").click()); console.log("during:", text(), "gates", gates.length);
  await settle(() => gates[0].resolve()); console.log("after success:", text()); out("success log", log); log.length = 0;
  t.value = "fail"; await settle(() => screen.getByRole("button").click()); console.log("during fail:", text());
  await settle(() => gates[1].resolve()); console.log("after fail:", text()); out("fail log", log);
});

test("4.1 pattern: addOptimistic + await formAction inside form action", async () => {
  const gates: any[] = []; const log: string[] = [];
  function C() {
    const [state, formAction, isPending] = useActionState(async (prev: string[], fd: FormData) => { const g = deferred<void>(); gates.push(g); await g.promise; return [...prev, String(fd.get("text"))]; }, [] as string[]);
    const [opt, addOpt] = useOptimistic(state, (cur: string[], t: string) => [...cur, t + "*"]);
    log.push(`render state=${state} opt=${opt} pending=${isPending}`);
    async function submit(fd: FormData) { addOpt(String(fd.get("text"))); await formAction(fd); }
    return <form action={submit}><input name="text" aria-label="t" defaultValue="hi" /><button>go</button><p>{opt.join("|")}</p></form>;
  }
  await act(async () => { render(<C />); }); log.length = 0;
  await settle(() => screen.getByRole("button").click()); console.log("during:", text());
  await settle(() => gates[0].resolve()); console.log("after:", text()); out("log", log);
});

test("use(unstable promise) on client", async () => {
  const errs: string[] = []; const orig = console.error; console.error = (...a: any[]) => { errs.push(String(a[0]).slice(0, 200)); };
  let renders = 0;
  function Bad() { renders++; const v = use(new Promise<string>(r => setTimeout(() => r("x"), 10))); return <p>{v}</p>; }
  await act(async () => { render(<Suspense fallback="FB"><Bad /></Suspense>); });
  await settle(() => {}, 200);
  console.error = orig;
  console.log("unstable promise: renders =", renders, "text =", text(), "errs:", errs);
});

test("conditional use / after early return", async () => {
  const Ctx = createContext("dflt");
  const errs: string[] = [];
  const orig = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 200));
  function P({ compact }: { compact: boolean }) { if (compact) return <span>c</span>; const v = use(Ctx); return <span>{v}</span>; }
  await act(async () => { render(<Ctx value="prov"><P compact={false} /></Ctx>); }); console.log("ctx use:", text());
  // use(context) with different hook order across renders
  const { rerender } = render(<Ctx value="prov"><P compact={true} /></Ctx>);
  rerender(<Ctx value="prov"><P compact={false} /></Ctx>);
  console.error = orig; console.log("errs", errs);
});

test("use(promise) in try/catch + rejected", async () => {
  const errs: string[] = []; const orig = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 200));
  const p = Promise.reject(new Error("boom")); p.catch(() => {});
  function P() { try { const u = use(p); return <h1>{String(u)}</h1>; } catch { return <p>Failed-caught</p>; } }
  class EB extends (await import("react")).Component<{ children: any }, { e: boolean }> { state = { e: false }; static getDerivedStateFromError() { return { e: true }; } render() { return this.state.e ? <p>boundary</p> : this.props.children; } }
  await act(async () => { render(<EB><Suspense fallback="FB"><P /></Suspense></EB>); }); await settle();
  console.error = orig; console.log("try/catch rejected use:", text(), errs.slice(0,2));
});

test("Activity", async () => {
  const log: string[] = [];
  function Pane({ name }: { name: string }) {
    const [n, setN] = useState(0);
    useEffect(() => { log.push(`${name} effect`); return () => log.push(`${name} cleanup`); }, []);
    useEffect(() => { log.push(`${name} effect(every)`); return () => log.push(`${name} cleanup(every)`); });
    log.push(`${name} render n=${n}`);
    return <div><button onClick={() => setN(n + 1)}>{name}{n}</button></div>;
  }
  function Tabs({ a }: { a: "f" | "s" }) {
    return <><Activity mode={a === "f" ? "visible" : "hidden"}><Pane name="F" /></Activity><Activity mode={a === "s" ? "visible" : "hidden"}><Pane name="S" /></Activity></>;
  }
  const { rerender } = render(<Tabs a="f" />); await settle(); out("mount (F visible, S hidden)", log); log.length = 0;
  console.log("DOM:", document.body.innerHTML);
  await settle(() => screen.getByText("F0").click()); console.log(text()); log.length = 0;
  rerender(<Tabs a="s" />); await settle(); out("switch to S", log); log.length = 0; console.log("DOM:", document.body.innerHTML);
  rerender(<Tabs a="f" />); await settle(); out("switch back to F", log); console.log("DOM:", document.body.innerHTML);
});

test("useEffectEvent", async () => {
  const log: string[] = [];
  function Chat({ roomId, theme }: { roomId: string; theme: string }) {
    const onC = useEffectEvent(() => { log.push(`connected ${roomId} theme=${theme}`); });
    useEffect(() => { log.push(`connect ${roomId}`); onC(); return () => log.push(`disconnect ${roomId}`); }, [roomId]);
    return null;
  }
  const { rerender } = render(<Chat roomId="a" theme="light" />); await settle();
  rerender(<Chat roomId="a" theme="dark" />); await settle(); rerender(<Chat roomId="b" theme="dark" />); await settle();
  out("effectEvent", log);
  // call during render
  const errs: string[] = []; const orig = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 200));
  let thrown = "";
  function Bad() { const e = useEffectEvent(() => 1); try { e(); } catch (er: any) { thrown = er.message; } return null; }
  render(<Bad />); console.error = orig; console.log("call in render ->", thrown, errs);
});

test("StrictMode double render counts with transitions/effects", async () => {
  const log: string[] = [];
  function App() { const [n, setN] = useState(0); const [p, st] = useTransition(); log.push(`render n=${n} p=${p}`); useEffect(() => { log.push("effect"); return () => log.push("cleanup"); }, []); return <button onClick={() => st(() => setN(n + 1))}>{n}</button>; }
  render(<StrictMode><App /></StrictMode>); await settle(); out("strict mount", log); log.length = 0;
  await settle(() => screen.getByRole("button").click()); out("strict transition click", log);
});
