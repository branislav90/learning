import React, {useState,useEffect,startTransition,useLayoutEffect,Profiler} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('rebase', async ()=>{
  const log=[];
  function C(){ const [n,setN]=useState(1);
    log.push('render n='+n);
    return <button onClick={()=>{ startTransition(()=>setN(x=>{log.push('T updater x='+x);return x+1})); setN(x=>{log.push('U updater x='+x);return x*2}); }}>{n}</button>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<C/>)); log.length=0;
  await act(()=>{ c.querySelector('button').click(); });
  console.log('REBASE', log.join(' | '), c.textContent);
});
test('rebase separate commits', async ()=>{
  const log=[];
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  function C(){ const [n,setN]=useState(1);
    useLayoutEffect(()=>{log.push('commit n='+n)});
    return <button onClick={()=>{ startTransition(()=>setN(x=>{log.push('T x='+x);return x+1})); setN(x=>{log.push('U x='+x);return x*2}); }}>{n}</button>}
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  r.render(<C/>); await new Promise(r=>setTimeout(r,50)); log.length=0;
  c.querySelector('button').dispatchEvent(new MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,100));
  console.log('REBASE2', log.join(' | '), c.textContent);
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});
