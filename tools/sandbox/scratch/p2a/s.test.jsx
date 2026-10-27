import React, {useState,useTransition,startTransition} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
test('async transition', async ()=>{
  const log=[]; let go;
  function C(){ const [p,st]=useTransition(); const [a,setA]=useState(0); const [b,setB]=useState(0); const [c2,setC]=useState(0);
    log.push(`render pending=${p} a=${a} b=${b} c=${c2}`);
    go=()=>st(async()=>{ setA(1); await sleep(20); setB(1); startTransition(()=>setC(1)); });
    return <i/>}
  const c=document.createElement('div'); const r=createRoot(c); await act(()=>r.render(<C/>)); log.length=0;
  await act(async()=>{ go(); await sleep(60); });
  console.log('ASYNCT', log.join(' | '));
});
