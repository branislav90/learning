import { test } from "vitest";
import * as React from "react";
import { Suspense } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
test("click replay", async () => {
  let ready = true; let waiters: (() => void)[] = [];
  const calls: string[] = [];
  let p: Promise<void> | null = null;
  function Slow() { if (!ready) { p = p || new Promise<void>((r) => waiters.push(r)); throw p; } return <button onClick={() => calls.push("click")}>b</button>; }
  const App = () => <Suspense fallback="loading"><Slow /></Suspense>;
  const html = renderToString(<App />);
  ready = false;
  const c = document.createElement("div"); c.innerHTML = html; document.body.appendChild(c);
  hydrateRoot(c, <App />);
  await sleep(50);
  const btn = c.querySelector("button")!;
  btn.click();
  await sleep(50);
  console.log("before ready:", calls.length, c.innerHTML);
  ready = true; waiters.forEach((w) => w()); 
  await sleep(200);
  console.log("after ready:", calls.length, c.innerHTML);
  btn.click(); console.log("after manual click:", calls.length);
});
