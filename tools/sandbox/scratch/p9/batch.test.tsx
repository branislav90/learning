// @vitest-environment jsdom
import React, { useState, useEffect, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { test, expect, vi } from "vitest";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test("batching in timeout + strictmode effects", async () => {
  const logs: string[] = [];
  function C() {
    const [a, setA] = useState(0); const [b, setB] = useState(0);
    logs.push(`render ${a} ${b}`);
    useEffect(() => { logs.push("setup"); return () => { logs.push("cleanup"); }; }, []);
    return <button onClick={() => setTimeout(() => { setA(x => x + 1); setB(x => x + 1); }, 0)}>go</button>;
  }
  const el = document.createElement("div"); document.body.append(el);
  const root = createRoot(el);
  await act(async () => { root.render(<StrictMode><C /></StrictMode>); });
  logs.push("--click");
  await act(async () => { el.querySelector("button")!.click(); await new Promise(r => setTimeout(r, 10)); });
  console.log(logs.join("\n"));
});
