// @vitest-environment jsdom
import React, { createContext, use, useRef } from "react";
import * as ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
test("r19", () => {
  const Ctx = createContext("d");
  function C(){ return <b>{use(Ctx)}</b>; }
  const { container } = render(<Ctx value="x"><C/></Ctx>);
  console.log("ctx", container.innerHTML);
  function In({ref, ...p}: any){ return <input ref={ref} {...p}/>; }
  let r: any; function P(){ const rr = useRef(null); r = rr; return <In ref={rr}/>; }
  render(<P/>); console.log("refprop", r.current?.tagName);
  function D({a}: {a?: string}){ return <i>{String(a)}</i>; }
  (D as any).defaultProps = { a: "dflt" };
  const c2 = render(<D/>); console.log("defaultProps", c2.container.innerHTML);
  console.log("render/hydrate", typeof (ReactDOM as any).render, typeof (ReactDOM as any).hydrate, typeof (ReactDOM as any).findDOMNode, typeof (ReactDOM as any).unmountComponentAtNode, typeof React.use, typeof React.useActionState, typeof React.useOptimistic, typeof (ReactDOM as any).useFormStatus);
  const spy = vi.spyOn(console,"error").mockImplementation(()=>{});
  function PT(){ return <u/>; } (PT as any).propTypes = { x: ()=>new Error("pt") };
  render(<PT {...{x:1}}/>); console.log("propTypes errs", spy.mock.calls.length);
});
