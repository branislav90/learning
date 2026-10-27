// @vitest-environment jsdom
import React, {Activity, useState, useEffect, useEffectEvent, Profiler, StrictMode, act} from 'react';
import {createRoot} from 'react-dom/client';
import {test} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('activity', ()=>{
  const log:string[]=[];
  function K(){const [n,setN]=useState(0);useEffect(()=>{log.push('setup');return()=>log.push('cleanup')},[]);return <button onClick={()=>setN(n+1)}>{n}</button>}
  const c=document.createElement('div');const r=createRoot(c);
  act(()=>r.render(<Activity mode="visible"><K/></Activity>));
  act(()=>c.querySelector('button')!.click());
  act(()=>r.render(<Activity mode="hidden"><K/></Activity>));
  console.log('HIDDEN', c.innerHTML, log.join());
  act(()=>r.render(<Activity mode="visible"><K/></Activity>));
  console.log('VISIBLE', c.innerHTML, log.join());
});
test('profiler strict', ()=>{
  let calls=0,renders=0;
  function C(){const [n,s]=useState(0);renders++;return <button onClick={()=>s(n+1)}>{n}</button>}
  const c=document.createElement('div');const r=createRoot(c);
  act(()=>r.render(<StrictMode><Profiler id="p" onRender={()=>calls++}><C/></Profiler></StrictMode>));
  act(()=>c.querySelector('button')!.click());
  console.log('PROFILER calls',calls,'renders',renders);
});
