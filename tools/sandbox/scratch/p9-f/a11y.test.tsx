import { test } from "vitest";
import * as React from "react";
import { StrictMode, useId, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { createRoot } from "react-dom/client";
import { act } from "@testing-library/react";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test("useId format + inert + title hoisting", async () => {
  function Id() { const a = useId(); const b = useId(); return <div id={a} data-b={b}>x</div>; }
  console.log("useId SSR:", renderToString(<Id />));
  console.log("inert:", renderToString(<div inert>a</div>));
  console.log("inert false:", renderToString(<div inert={false}>a</div>));
  const html = renderToString(<html><head><title>A</title></head><body><main><title>Page</title><meta name="description" content="d" /><link rel="canonical" href="https://x.com/" /><h1>Hi</h1></main></body></html>);
  console.log("html w/ nested title:", html);
  const html2 = renderToString(<html><head></head><body><title>First</title><div><title>Second</title></div></body></html>);
  console.log("two titles:", html2);
});

test("route focus effect under StrictMode", async () => {
  const focused: string[] = [];
  function RouteFocus({ pathname }: { pathname: string }) {
    const ref = useRef<HTMLDivElement>(null); const first = useRef(true);
    useEffect(() => {
      if (first.current) { first.current = false; return; }
      focused.push("focus@" + pathname);
    }, [pathname]);
    return <div ref={ref} tabIndex={-1}><h1>x</h1></div>;
  }
  const c = document.createElement("div"); document.body.appendChild(c);
  const r = createRoot(c);
  await act(async () => { r.render(<StrictMode><RouteFocus pathname="/a" /></StrictMode>); });
  console.log("after StrictMode initial mount:", focused);
  await act(async () => { r.render(<StrictMode><RouteFocus pathname="/b" /></StrictMode>); });
  console.log("after nav:", focused);
});
