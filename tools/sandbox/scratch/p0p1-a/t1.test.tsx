import React, {useState,useMemo,StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
import {test,expect} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
test('refcb', async()=>{
  const log:string[]=[]; let set:any;
  function C(){ const [n,s]=useState(0); set=s; return <div ref={(el)=>{log.push('attach'+n); return ()=>log.push('cleanup'+n);}}>{n}</div>; }
  const root=createRoot(document.createElement('div'));
  await act(async()=>root.render(<C/>)); await act(async()=>set(1));
  console.log('REFCB',log.join(','));
});
test('memo strict + same state bailout', async()=>{
  let memo=0, renders=0, set:any;
  function C(){ renders++; const [t,s]=useState([1]); set=s; useMemo(()=>{memo++;return 1},[]); return <p>{t.length}</p>; }
  const root=createRoot(document.createElement('div'));
  await act(async()=>root.render(<StrictMode><C/></StrictMode>));
  console.log('STRICT memo calls',memo,'renders',renders);
  renders=0; const same=[1];
  await act(async()=>set(same)); const r1=renders; // new array vs initial -> rerender
  renders=0; await act(async()=>set(same)); console.log('same-ref setState renders',r1,renders);
});
