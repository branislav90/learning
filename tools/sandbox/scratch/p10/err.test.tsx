// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { test, expect, vi } from "vitest";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

class EB extends React.Component<any, {e: boolean}> {
  state = { e: false };
  static getDerivedStateFromError() { return { e: true }; }
  componentDidCatch(e: Error, info: any) { log.push("cDC"); }
  render() { return this.state.e ? <p>fallback</p> : this.props.children; }
}
const log: string[] = [];
function Bomb(): never { throw new Error("boom"); }

test("caught", async () => {
  const c = document.createElement("div");
  const root = createRoot(c, {
    onCaughtError(e: any, info: any) { log.push("caught:" + Object.keys(info).join(",") + ":" + typeof info.errorBoundary); },
    onUncaughtError(e: any, info: any) { log.push("uncaught"); },
    onRecoverableError(e: any, info: any) { log.push("recov"); },
  });
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  await act(async () => root.render(<EB><Bomb/></EB>));
  console.log(log, c.innerHTML, spy.mock.calls.length);
  log.length = 0;
  const c2 = document.createElement("div");
  const root2 = createRoot(c2, {
    onCaughtError(e: any, info: any) { log.push("caught"); },
    onUncaughtError(e: any, info: any) { log.push("uncaught:" + Object.keys(info).join(",")); },
  });
  try { await act(async () => root2.render(<Bomb/>)); } catch(e){ log.push('act-threw'); }
  console.log(log, JSON.stringify(c2.innerHTML));
  // effect throw & event handler throw
  log.length = 0;
  const c3 = document.createElement("div");
  const root3 = createRoot(c3, { onCaughtError(){log.push("caught")}, onUncaughtError(){log.push("uncaught")} });
  function Eff(){ React.useEffect(()=>{ throw new Error("eff"); },[]); return <i/>; }
  try { await act(async () => root3.render(<EB><Eff/></EB>)); } catch(e){ log.push('act-threw'); }
  console.log("effect", log, c3.innerHTML);
  // js url
  const html = renderToString(<a href="javascript:alert(1)">x</a>);
  console.log("ssr", html);
  const c4 = document.createElement("div");
  const root4 = createRoot(c4);
  await act(async()=>root4.render(<a href="javascript:alert(1)">x</a>));
  console.log("dom", c4.innerHTML, spy.mock.calls.map(c=>String(c[0]).slice(0,100)));
  const html2 = renderToString(<form action="javascript:alert(1)"/>);
  console.log("form", html2);
  console.log(renderToString(<a href=" JaVaScript:alert(1)">x</a>), renderToString(<iframe src="javascript:1"/>), renderToString(<a href="data:text/html,x">x</a>));
});
