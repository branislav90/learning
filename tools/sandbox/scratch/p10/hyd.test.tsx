// @vitest-environment jsdom
import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { test } from "vitest";
test("h", async () => {
  const c = document.createElement("div"); document.body.append(c);
  c.innerHTML = renderToString(<p>server</p>);
  const log: any[] = [];
  hydrateRoot(c, <p>client</p>, { onRecoverableError(e: any, info: any){ log.push([e.message.slice(0,60), Object.keys(info)]); } });
  await new Promise(r=>setTimeout(r,100));
  console.log("hyd", JSON.stringify(log), c.innerHTML);
  const evs: string[] = [];
  window.addEventListener("error", e=>{ evs.push(e.message); e.preventDefault(); });
  const c2 = document.createElement("div"); document.body.append(c2);
  const r = createRoot(c2, { onUncaughtError(){ evs.push("onUncaught"); } });
  r.render(<button onClick={()=>{ throw new Error("handler"); }}>x</button>);
  await new Promise(r=>setTimeout(r,50));
  c2.querySelector("button")!.click();
  await new Promise(r=>setTimeout(r,50));
  console.log("handler", evs, c2.innerHTML);
});
