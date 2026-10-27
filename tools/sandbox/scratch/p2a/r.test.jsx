import React, {useState,useEffect,useLayoutEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
test('layout setState sync', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT=false; const log=[]; let first=true;
  function C(){ const [n,setN]=useState(0); if(first){first=false; setTimeout(()=>log.push('timeout0'),0); setImmediate(()=>log.push('immediate'));} log.push('render '+n); useLayoutEffect(()=>{log.push('layout '+n); if(n===0) setN(1)},[n]); return <i>{n}</i>}
  const c=document.createElement('div'); const r=createRoot(c); r.render(<C/>); await sleep(50); console.log('LAYOUTSET', log.join(' | '));
});
test('unmount refs', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT=true; const log=[];
  function C(){ const ref=useRef(null); useLayoutEffect(()=>()=>log.push('layout cleanup ref='+(ref.current?'node':'null')+' connected='+(ref.current?.isConnected)),[]); useEffect(()=>()=>log.push('passive cleanup ref='+(ref.current?'node':'null')),[]); return <i ref={ref}/>}
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c); await act(()=>r.render(<C/>)); await act(()=>r.unmount()); console.log('UNMOUNTREF', log.join(' | '));
});
test('max depth', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT=true; const err=console.error; console.error=()=>{};
  function C(){ const [n,setN]=useState(0); useLayoutEffect(()=>{setN(n+1)}); return <i>{n}</i>}
  const c=document.createElement('div'); const r=createRoot(c); let msg='';
  try{ await act(()=>r.render(<C/>)); }catch(e){msg=e.message}
  console.error=err; console.log('MAXDEPTH', msg.slice(0,140));
});
