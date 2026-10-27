import React, { useState, useEffect, useRef, StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { flushSync } from "react-dom";
import { test } from "vitest";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const mount = (el: React.ReactElement) => { const c = document.createElement("div"); c.id="root"; document.body.appendChild(c); const r = createRoot(c); act(()=>r.render(el)); return {c,r}; };

test("13 4.2 order", async () => {
  const log: string[] = [];
  const c = document.createElement("div"); document.body.appendChild(c);
  const root = createRoot(c);
  act(() => root.render(<div id="a" onClickCapture={() => log.push("a capture")} onClick={() => log.push("a bubble")}><button id="c" onClick={(e)=>log.push("c bubble "+e.currentTarget.id)}>x</button></div>));
  c.addEventListener("click", () => log.push("native root bubble"));
  document.addEventListener("click", () => log.push("native document bubble"));
  document.addEventListener("click", () => log.push("native document capture"), true);
  await act(async()=>{ c.querySelector("button")!.click(); });
  console.log("13-4.2:", log.join(" | "));
  // with stopPropagation
  const log2: string[] = [];
  const c2 = document.createElement("div"); document.body.appendChild(c2);
  const r2 = createRoot(c2);
  act(()=>r2.render(<div onClick={()=>log2.push("a bubble")}><button onClick={(e)=>{e.stopPropagation();log2.push("c")}}>x</button></div>));
  c2.addEventListener("click",()=>log2.push("native root2"));
  document.addEventListener("click",()=>log2.push("doc"));
  await act(async()=>{ c2.querySelector("button")!.click(); });
  console.log("13-stop:", log2.join(" | "));
});

test("11 4.2 handler end / render 2", async () => {
  const log: string[] = [];
  function Counter(){ const [n,setN]=useState(0); log.push("render "+n); return <button onClick={()=>{setN(x=>x+1);setN(x=>x+1);log.push("handler end")}}>{n}</button>; }
  const {c} = mount(<Counter/>);
  log.length=0;
  await act(async()=>{ c.querySelector("button")!.click(); });
  console.log("11-4.2:", log.join(" | "));
});

test("13 5.4 menu flash", async () => {
  const log: string[] = [];
  function Menu(){
    const [open,setOpen]=useState(false); const ref=useRef<HTMLDivElement>(null);
    useEffect(()=>{ if(!open) return; log.push("effect add"); const f=(e:MouseEvent)=>{ log.push("doc click handler"); if(!ref.current?.contains(e.target as Node)) setOpen(false)}; document.addEventListener("click",f); return ()=>document.removeEventListener("click",f)},[open]);
    return <div><button onClick={()=>setOpen(true)}>Open</button>{open&&<div ref={ref}>menu</div>}</div>;
  }
  const {c} = mount(<Menu/>);
  // real dispatch not wrapped in act to see natural flush
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
  c.querySelector("button")!.click();
  await new Promise(r=>setTimeout(r,50));
  console.log("13-5.4:", log.join(" | "), "menu present:", !!c.querySelector("div div"));
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

test("focus bubbles / onChange / disabled", async () => {
  const log: string[] = [];
  const {c} = mount(<div onFocus={()=>log.push("div onFocus")} onClick={()=>log.push("div click")}><input onFocus={()=>log.push("in focus")} onChange={()=>log.push("change")}/><button disabled>d</button></div>);
  const inp = c.querySelector("input")!;
  await act(async()=>{ inp.focus(); });
  console.log("focus:", log.join(" | "));
  await act(async()=>{ c.querySelector("button")!.click(); });
  console.log("disabled click (jsdom .click()):", log.join(" | "));
  await act(async()=>{ c.querySelector("button")!.dispatchEvent(new MouseEvent("click",{bubbles:true})); });
  console.log("disabled dispatchEvent:", log.join(" | "));
});

test("wheel passive", async () => {
  const warn: any[] = []; const o = console.error; console.error = (...a:any[])=>{warn.push(a.join(" "))};
  const {c} = mount(<div onWheel={(e)=>{e.preventDefault()}} onTouchStart={(e)=>{e.preventDefault()}}>x</div>);
  const ev = new WheelEvent("wheel",{bubbles:true,cancelable:true});
  const spy = Object.getOwnPropertyDescriptor; 
  // check passive option by patching addEventListener before mounting
  console.error = o;
  const opts: string[] = [];
  const orig = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(t:any,l:any,o2:any){ if(["wheel","touchstart","touchmove","scroll"].includes(t)) opts.push(t+":"+JSON.stringify(o2)); return orig.call(this,t,l,o2); } as any;
  const c3 = document.createElement("div"); document.body.appendChild(c3); const r=createRoot(c3); act(()=>r.render(<div/>));
  EventTarget.prototype.addEventListener = orig;
  console.log("passive opts:", opts.join(" ; "));
});

test("flushSync in effect warning", async () => {
  const errs: string[] = []; const o = console.error; console.error=(...a:any[])=>{errs.push(String(a[0]).slice(0,200))};
  function C(){ const [n,setN]=useState(0); useEffect(()=>{ flushSync(()=>setN(1)); },[]); return <p>{n}</p>; }
  mount(<C/>);
  console.error=o; console.log("flushSync warn:", errs.join(" || "));
});

test("strict mode fetch effect", async () => {
  const log:string[]=[];
  function U(){ useEffect(()=>{ log.push("start"); return ()=>log.push("abort")},[]); return <p/>; }
  mount(<StrictMode><U/></StrictMode>); console.log("strict:", log.join(","));
});

test("lazy rejection caching", async () => {
  let calls=0; const L = lazy(()=>{calls++; return Promise.reject(new Error("fail"));});
  class EB extends React.Component<any,{e:boolean}>{ state={e:false}; static getDerivedStateFromError(){return {e:true}} render(){return this.state.e?<i>err</i>:this.props.children}}
  const o=console.error; console.error=()=>{};
  const m = (k:number)=>mount(<EB key={k}><Suspense fallback="..."><L/></Suspense></EB>);
  await act(async()=>{ m(1); }); await act(async()=>{ m(2); });
  console.error=o; console.log("lazy factory calls after two mounts:", calls);
});
