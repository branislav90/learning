import { test } from "vitest";
import * as React from "react";
import { Suspense, lazy, useState } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "@testing-library/react";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let release: () => void;
const gate = new Promise<void>((r) => (release = r));
const calls: string[] = [];
function Btn() { return <button onClick={() => calls.push("click")}>b</button>; }
function Slow() { if (!(globalThis as any).__ready) throw gate; return <Btn />; }
function App() { return <Suspense fallback="loading"><Slow /></Suspense>; }

test("click replay on dehydrated boundary", async () => {
  (globalThis as any).__ready = true;
  const html = renderToString(<App />);
  (globalThis as any).__ready = false;
  const c = document.createElement("div"); c.innerHTML = html; document.body.appendChild(c);
  console.log("html:", c.innerHTML);
  const root = hydrateRoot(c, <App />);
  await sleep(20);
  c.querySelector("button")!.click();
  await sleep(20);
  console.log("calls before release:", calls.slice());
  (globalThis as any).__ready = true; release();
  await sleep(100);
  console.log("calls after hydration:", calls);
});

test("submit replay with client function action", async () => {
  const seen: string[] = [];
  function F() { return <form action={(fd: FormData) => { seen.push(String(fd.get("n"))); }}><input name="n" defaultValue="v" /><button>go</button></form>; }
  const html = renderToString(<F />);
  const c = document.createElement("div"); c.innerHTML = html; document.body.appendChild(c);
  // script inline: execute
  const sc = c.querySelector("script")!.textContent!; (0, eval)(sc);
  const form = c.querySelector("form")!;
  console.log("action attr:", form.getAttribute("action"));
  (c.querySelector("button") as HTMLButtonElement).click();
  console.log("replay queue:", ((document as any).$$reactFormReplay || []).length / 3);
  hydrateRoot(c, <F />);
  await sleep(100);
  console.log("seen after hydration:", seen);
});
