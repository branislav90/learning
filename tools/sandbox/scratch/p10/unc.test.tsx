// @vitest-environment jsdom
import React from "react";
import { createRoot } from "react-dom/client";
import { test } from "vitest";
function Bomb(): never { throw new Error("boom"); }
test("unc", async () => {
  const log: string[] = [];
  const c = document.createElement("div");
  const root = createRoot(c, { onUncaughtError(e: any, i: any){ log.push("uncaught:"+Object.keys(i)); }, onCaughtError(){log.push("c")} });
  root.render(<Bomb/>);
  await new Promise(r=>setTimeout(r,100));
  console.log(log, JSON.stringify(c.innerHTML));
  // default (no callback): reportError?
  const evs: string[] = [];
  window.addEventListener("error", e=>{ evs.push("window.error:"+e.message); e.preventDefault(); });
  const c2 = document.createElement("div");
  createRoot(c2).render(<Bomb/>);
  await new Promise(r=>setTimeout(r,100));
  console.log(evs);
});
