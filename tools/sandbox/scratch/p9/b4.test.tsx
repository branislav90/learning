// @vitest-environment jsdom
import React, { useActionState } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { test, vi } from "vitest";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test("b4", async () => {
  vi.useFakeTimers();
  const t0 = Date.now(); const log: string[] = [];
  function App() {
    const [state, action, pending] = useActionState(async (prev: { n: number }, fd: FormData) => {
      log.push(`start prev=${prev.n} t=${Date.now()-t0}`);
      await new Promise((r) => setTimeout(r, 500));
      return { n: prev.n + Number(fd.get("by")) };
    }, { n: 0 });
    log.push(`render n=${state.n} pending=${pending} t=${Date.now()-t0}`);
    return <form action={action}><input name="by" defaultValue="1" /><button>Add</button><output>{state.n}</output></form>;
  }
  const el = document.createElement("div"); document.body.append(el);
  const root = createRoot(el);
  await act(async () => { root.render(<App />); });
  const form = el.querySelector("form")!; const btn = el.querySelector("button")!;
  for (let i = 0; i < 3; i++) { await act(async () => { btn.click(); await vi.advanceTimersByTimeAsync(30); }); }
  for (let i=0;i<20;i++){ await act(async () => { await vi.advanceTimersByTimeAsync(100); }); }
  console.log(log.join("\n")); console.log("final", el.querySelector("output")!.textContent, "input", (el.querySelector("input") as HTMLInputElement).value);
});
