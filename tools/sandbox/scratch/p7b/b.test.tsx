import React, { memo, Suspense, use, useState, useTransition } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('A5 suspense in transition', async () => {
  const cache = new Map<string, Promise<string>>(); const res = new Map<string,(v:string)=>void>();
  const get=(k:string)=>{ if(!cache.has(k)) cache.set(k,new Promise(r=>res.set(k,r))); return cache.get(k)!; };
  function Page({t}:{t:string}){ const v=use(get(t)); return <p>page:{v}</p>; }
  function App(){ const [t,setT]=useState('a'); const [p,st]=useTransition();
    return <><button onClick={()=>st(()=>setT('b'))}>go {String(p)}</button><Suspense fallback={<p>FALLBACK</p>}><Page t={t}/></Suspense></>; }
  render(<App/>);
  expect(screen.getByText('FALLBACK')).toBeTruthy();
  await act(async()=>{res.get('a')!('A');});
  console.log('initial', document.body.textContent);
  await act(async()=>{fireEvent.click(screen.getByText(/go/));});
  console.log('during', document.body.textContent);
  await act(async()=>{res.get('b')!('B');});
  console.log('after', document.body.textContent);
});
test('B3 child renders', () => {
  const log:string[]=[]; 
  const Child=memo(({x}:{x:number})=>{log.push('child'+x);return <i/>});
  function P(){ const [c,setC]=useState(0); const [x,setX]=useState(0); const [p,st]=useTransition();
    return <><button onClick={()=>{setC(c+1); st(()=>setX(x+1));}}>b</button>{c}<Child x={x}/></>; }
  render(<P/>); log.length=0;
  act(()=>{fireEvent.click(screen.getByText('b'));}); console.log('B3', log);
});
