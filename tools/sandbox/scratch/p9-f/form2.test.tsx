import { test } from "vitest";
import * as React from "react";
import { useActionState, useOptimistic, useState, useTransition, startTransition, use } from "react";
import { requestFormReset } from "react-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("D3 optimistic with startTransition wrapped real update", async () => {
  const renders: string[] = [];
  function F() {
    const [real, setReal] = useState<string[]>(["a"]);
    const [opt, addOpt] = useOptimistic(real, (cur: string[], n: string) => [...cur, n + "(tmp)"]);
    renders.push(opt.join(","));
    return <form action={async (fd: FormData) => { addOpt(String(fd.get("t"))); await sleep(20); startTransition(() => setReal((r) => [...r, String(fd.get("t"))])); }}>
      <input name="t" defaultValue="x" /><button>d</button></form>;
  }
  render(<F />); renders.length = 0;
  await userEvent.click(screen.getByText("d"));
  await act(async () => { await sleep(80); });
  console.log("D3 renders:", renders);
});

test("D4 optimistic failure (returned error), real unchanged", async () => {
  const renders: string[] = [];
  function F() {
    const [real] = useState<string[]>(["a"]);
    const [opt, addOpt] = useOptimistic(real, (cur: string[], n: string) => [...cur, n + "(tmp)"]);
    const [err, act2] = useActionState(async (_p: string, fd: FormData) => { addOpt("x"); await sleep(20); return "rejected"; }, "");
    renders.push(opt.join(",") + "|" + err);
    return <form action={act2}><button>d</button></form>;
  }
  render(<F />); renders.length = 0;
  await userEvent.click(screen.getByText("d"));
  await act(async () => { await sleep(80); });
  console.log("D4 renders:", renders);
});

test("F2 requestFormReset in action", async () => {
  function F() {
    const [v, setV] = useState("");
    return <form action={async (fd: FormData) => { requestFormReset(document.querySelector("form")!); }}>
      <input name="n" aria-label="n7" defaultValue="d" /><button type="button" onClick={() => startTransition(() => requestFormReset(document.querySelector("form")!))}>reset</button></form>;
  }
  render(<F />);
  const i = screen.getByLabelText("n7") as HTMLInputElement;
  await userEvent.clear(i); await userEvent.type(i, "zz");
  await userEvent.click(screen.getByText("reset"));
  await act(async () => { await sleep(30); });
  console.log("F2 value after requestFormReset in transition:", i.value);
  await userEvent.clear(i); await userEvent.type(i, "yy");
  const errs: string[] = []; const spy = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0,150));
  document.querySelector("form")!.querySelector("button")!.click();
  console.error = spy;
  console.log("F2b outside transition value", i.value, errs);
});

test("H useActionState direct call outside transition", async () => {
  const errs: string[] = []; const spy = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0,200));
  let d: any;
  function F() { const [s, a, p] = useActionState(async (p: number) => { await sleep(5); return p + 1; }, 0); d = a; return <p>{s}</p>; }
  render(<F />);
  await act(async () => { d(); await sleep(30); });
  console.error = spy;
  console.log("H errs:", errs);
});

test("I action throws inside useActionState sync after pending", async () => {
  const errs: string[] = []; const spy = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0,200));
  let d: any;
  function F() { const [s, a, p] = useActionState((p: number) => { return p + 1; }, 0); d = a; return <p>{s}</p>; }
  render(<F />);
  await act(async () => { startTransition(() => d()); });
  console.error = spy;
  console.log("I sync reducer ok:", document.body.textContent, errs);
});
