// @vitest-environment jsdom
import React, {useState, memo, useMemo, useRef, useCallback, createContext, useContext, Profiler, StrictMode, useEffect} from "react";
import {render, act, screen, fireEvent} from "@testing-library/react";
import {test, expect} from "vitest";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test("bailout", async () => {
  let n=0; let set:any;
  function C(){ n++; const [s,setS]=useState(0); set=setS; return <i>{s}</i>; }
  render(<C/>); console.log("mount",n);
  act(()=>set(1)); console.log("after set1",n);
  act(()=>set(1)); console.log("after set1 again",n);
  act(()=>set(1)); console.log("after set1 3rd",n);
});
test("inline ref callback", () => {
  const log:string[]=[];
  function C(){ const [,f]=useState(0); (C as any).f=f;
    return <div ref={(el)=>{log.push(el?"attach":"null"); }} />; }
  render(<C/>); act(()=>(C as any).f(1)); act(()=>(C as any).f(2));
  console.log("inline ref no cleanup", log.join());
  const log2:string[]=[];
  function D(){ const [,f]=useState(0); (D as any).f=f;
    return <div ref={(el)=>{log2.push("attach"); return ()=>log2.push("cleanup");}} />; }
  render(<D/>); act(()=>(D as any).f(1));
  console.log("inline ref w/ cleanup", log2.join());
});
test("profiler phases", () => {
  const ph:string[]=[]; let set:any;
  function C(){ const [s,setS]=useState(0); set=setS; useEffect(()=>{ if(s===1) setS(2)},[s]); return <i>{s}</i>}
  render(<Profiler id="x" onRender={(_,p)=>ph.push(p)}><C/></Profiler>);
  act(()=>set(1));
  console.log("phases",ph.join());
});
test("strict + memo + context", () => {
  let r=0;
  const Ctx=createContext({a:1,b:1});
  const Child=memo(function Child(){ r++; const {a}=useContext(Ctx); return <i>{a}</i>});
  function P(){ const [s,setS]=useState({a:1,b:1}); (P as any).s=setS; return <Ctx value={s}><Child/></Ctx>}
  render(<StrictMode><P/></StrictMode>); console.log("strict mount renders",r);
  r=0; act(()=>(P as any).s({a:1,b:2})); console.log("ctx change b only: child renders",r);
});
test("useMemo nested usage", ()=>{ let c=0; function C(){ const [,f]=useState(0); (C as any).f=f; useMemo(()=>{c++},[]); return null}
 render(<StrictMode><C/></StrictMode>); console.log("useMemo calls in strict mount",c);});
