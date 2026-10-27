import { test, expect } from "vitest";
import * as React from "react";
import { useActionState, useOptimistic, useState, useTransition, startTransition, Component } from "react";
import { useFormStatus, requestFormReset } from "react-dom";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const log: string[] = [];
const L = (s: string) => { log.push(s); };

test("A1 plain function action: reset after success", async () => {
  const seen: string[] = [];
  function F() {
    return <form action={async (fd: FormData) => { seen.push(String(fd.get("n"))); await sleep(10); }}>
      <input name="n" defaultValue="init" aria-label="n" /><button>go</button></form>;
  }
  render(<F />);
  const input = screen.getByLabelText("n") as HTMLInputElement;
  await userEvent.clear(input); await userEvent.type(input, "typed");
  expect(input.value).toBe("typed");
  await userEvent.click(screen.getByText("go"));
  await act(async () => { await sleep(50); });
  console.log("A1 seen", seen, "value after", input.value);
});

test("A2 action returns error object via useActionState: reset?", async () => {
  function F() {
    const [s, a] = useActionState(async (_p: any, fd: FormData) => ({ err: "bad", v: String(fd.get("n")) }), { err: "", v: "" });
    return <form action={a}><input name="n" aria-label="n" defaultValue={s.v} /><button>go</button><p>{s.err}</p></form>;
  }
  render(<F />);
  const input = screen.getByLabelText("n") as HTMLInputElement;
  await userEvent.type(input, "typed");
  await userEvent.click(screen.getByText("go"));
  await act(async () => { await sleep(30); });
  console.log("A2 value after (defaultValue from state)", input.value, screen.getByText("bad") && "err shown");
  // no defaultValue from state
  function G() {
    const [s, a] = useActionState(async (_p: any, fd: FormData) => ({ err: "bad" }), { err: "" });
    return <form action={a}><input name="n" aria-label="n2" /><button>go2</button><p>{s.err}</p></form>;
  }
  render(<G />);
  const i2 = screen.getByLabelText("n2") as HTMLInputElement;
  await userEvent.type(i2, "typed");
  await userEvent.click(screen.getByText("go2"));
  await act(async () => { await sleep(30); });
  console.log("A2b value after (no defaultValue)", JSON.stringify(i2.value));
});

test("A3 action throws: reset?", async () => {
  class EB extends Component<any, {e: any}> { state = { e: null }; static getDerivedStateFromError(e: any) { return { e }; } render() { return this.state.e ? <p>boundary:{String(this.state.e.message)}</p> : this.props.children; } }
  function F() {
    return <form action={async () => { await sleep(5); throw new Error("boom"); }}><input name="n" aria-label="n3" /><button>go3</button></form>;
  }
  const spy = console.error; console.error = () => {};
  render(<EB><F /></EB>);
  await userEvent.type(screen.getByLabelText("n3"), "x");
  await userEvent.click(screen.getByText("go3"));
  await act(async () => { await sleep(30); });
  console.error = spy;
  console.log("A3 boundary text:", document.body.textContent);
});

test("A4 controlled input not reset", async () => {
  function F() {
    const [v, setV] = useState("");
    return <form action={async () => { await sleep(5); }}><input name="n" aria-label="n4" value={v} onChange={(e) => setV(e.target.value)} /><button>go4</button></form>;
  }
  render(<F />);
  const i = screen.getByLabelText("n4") as HTMLInputElement;
  await userEvent.type(i, "keep");
  await userEvent.click(screen.getByText("go4"));
  await act(async () => { await sleep(30); });
  console.log("A4 controlled value after:", i.value);
});

test("B useActionState render sequence + pending + queue", async () => {
  const renders: string[] = [];
  const calls: string[] = [];
  function F() {
    const [s, a, p] = useActionState(async (prev: number, fd: FormData) => { calls.push(`start prev=${prev}`); await sleep(20); calls.push(`end`); return prev + 1; }, 0);
    renders.push(`state=${s} pending=${p}`);
    return <form action={a}><button>b</button><output>{s}</output></form>;
  }
  render(<F />);
  renders.length = 0;
  await userEvent.click(screen.getByText("b"));
  await act(async () => { await sleep(100); });
  console.log("B single submit renders:", renders, calls);
  renders.length = 0; calls.length = 0;
  const form = document.querySelector("form")!;
  await act(async () => { fireEvent.submit(form); fireEvent.submit(form); fireEvent.submit(form); await sleep(150); });
  console.log("B triple submit renders:", renders, calls);
});

test("C useFormStatus same component vs child, render counts", async () => {
  const childRenders: string[] = [];
  function Child() { const s = useFormStatus(); childRenders.push(`pending=${s.pending} method=${s.method} data=${s.data ? s.data.get("n") : null} action=${typeof s.action}`); return <button>c</button>; }
  function Same() { const s = useFormStatus(); L("same pending=" + s.pending); return <form action={async () => { await sleep(20); }}><input name="n" defaultValue="v" /><Child /></form>; }
  render(<Same />);
  childRenders.length = 0;
  await userEvent.click(screen.getByText("c"));
  await act(async () => { await sleep(80); });
  console.log("C child renders:", childRenders);
  console.log("C same:", log.join(" | "));
});

test("D useOptimistic", async () => {
  const renders: string[] = [];
  function F() {
    const [real, setReal] = useState<string[]>(["a"]);
    const [opt, addOpt] = useOptimistic(real, (cur: string[], n: string) => [...cur, n + "(tmp)"]);
    renders.push(opt.join(","));
    return <form action={async (fd: FormData) => { addOpt(String(fd.get("t"))); await sleep(20); setReal((r) => [...r, String(fd.get("t"))]); }}>
      <input name="t" defaultValue="x" /><button>d</button></form>;
  }
  render(<F />);
  renders.length = 0;
  await userEvent.click(screen.getByText("d"));
  await act(async () => { await sleep(80); });
  console.log("D renders:", renders);
  // failure: throw -> revert
});

test("D2 optimistic setter outside transition warns", async () => {
  const errs: string[] = [];
  const spy = console.error; console.error = (...a: any[]) => errs.push(a.map(String).join(" ").slice(0, 120));
  function F() { const [o, add] = useOptimistic(0, (c: number, n: number) => c + n); return <button onClick={() => add(1)}>{o}</button>; }
  render(<F />);
  await userEvent.click(screen.getByRole("button"));
  console.error = spy;
  console.log("D2 warnings:", errs);
});

test("E after-await setState in startTransition (async)", async () => {
  const renders: string[] = [];
  function F() {
    const [v, setV] = useState(0);
    const [p, st] = useTransition();
    renders.push(`v=${v} pending=${p}`);
    return <button onClick={() => st(async () => { await sleep(10); setV(1); })}>e</button>;
  }
  render(<F />);
  renders.length = 0;
  await userEvent.click(screen.getByText("e"));
  await act(async () => { await sleep(60); });
  console.log("E renders:", renders);
});

test("F requestFormReset and onReset", async () => {
  const ev: string[] = [];
  function F() {
    return <form ref={() => {}} onReset={() => ev.push("onReset")} action={async (fd: FormData) => { await sleep(5); }}>
      <input name="n" aria-label="n6" defaultValue="d" /><button>f</button></form>;
  }
  render(<F />);
  await userEvent.clear(screen.getByLabelText("n6")); await userEvent.type(screen.getByLabelText("n6"), "zzz");
  await userEvent.click(screen.getByText("f"));
  await act(async () => { await sleep(40); });
  console.log("F events:", ev, "value", (screen.getByLabelText("n6") as HTMLInputElement).value);
});

test("G submitter in formData and formAction override", async () => {
  const seen: any[] = [];
  function F() {
    return <form action={(fd: FormData) => { seen.push(["form", [...fd.entries()]]); }}>
      <input name="n" defaultValue="1" />
      <button name="intent" value="save">save</button>
      <button name="intent" value="del" formAction={(fd: FormData) => { seen.push(["button", [...fd.entries()]]); }}>del</button></form>;
  }
  render(<F />);
  await userEvent.click(screen.getByText("save"));
  await userEvent.click(screen.getByText("del"));
  await act(async () => { await sleep(20); });
  console.log("G:", JSON.stringify(seen));
});
