import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { flushSync } from "react-dom";
import { test } from "vitest";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test("fs", async()=>{
  const o=console.error; console.error=()=>{};
  const log:string[]=[];
  function C(){ const [n,setN]=useState(0); log.push("render "+n); useEffect(()=>{ flushSync(()=>setN(1)); log.push("after flushSync, DOM="+document.body.textContent); },[]); return <p>{n}</p>; }
  const c=document.createElement("div"); document.body.appendChild(c); const r=createRoot(c);
  await act(async()=>r.render(<C/>));
  console.error=o; console.log(log.join(" | "), "final", c.textContent);
});
