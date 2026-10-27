import { test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { lazy, Suspense, useState, useTransition } from "react";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test("lazy+transition", async () => {
  let calls = 0; let resolve!: (m:any)=>void;
  const L = lazy(() => { calls++; return new Promise<any>(r => (resolve = r)); });
  let go!: () => void;
  function App(){ const [p,setP]=useState("home"); const [pend,st]=useTransition(); go=()=>st(()=>setP("rep"));
    return <Suspense fallback={<i>FB</i>}>{p==="home"?<b>HOME{String(pend)}</b>:<L/>}</Suspense>; }
  const {container}=render(<App/>);
  console.log("calls before", calls);
  await act(async()=>{ go(); });
  console.log("during", container.innerHTML, "calls", calls);
  await act(async()=>{ resolve({default:()=> <u>REP</u>}); });
  console.log("after", container.innerHTML, "calls", calls);
});
