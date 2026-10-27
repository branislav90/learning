import React, { useState, useEffect, useRef, useLayoutEffect, StrictMode, startTransition } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=40) => new Promise(r => setTimeout(r, ms));
async function mountC(ui: any) { const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); root.render(ui); await tick(); return c; }
test('Demo timeline', async () => {
  const log: string[] = [];
  function Demo() { const [a,setA]=useState(0), [b,setB]=useState(0);
    useEffect(()=>{ log.push(`commit ${a}/${b}`); });
    return <button onClick={() => { setA(x=>x+1); setB(x=>x+1); setTimeout(()=>{ setA(x=>x+10); setB(x=>x+10); },0); }}>{a}/{b}</button>; }
  const c = await mountC(<Demo />); log.length = 0;
  c.querySelector('button')!.click(); await tick(60);
  console.log('DEMO', log);
});
test('B2', async () => {
  const log: string[] = [];
  function C() { const [n,setN]=useState(0), [m,setM]=useState(0);
    useEffect(()=>{ log.push(`commit ${n} ${m}`); });
    return <button onClick={async () => { setN(1); await Promise.resolve(); setN(2); setM(3); }}>x</button>; }
  const c = await mountC(<C />); log.length = 0;
  c.querySelector('button')!.click(); await tick(60);
  console.log('B2', log);
});
test('save flow: 2 renders', async () => {
  const log: string[] = [];
  function S() { const [st,setSt]=useState('idle'), [t,setT]=useState(0);
    useEffect(()=>{ log.push(`commit ${st} ${t}`); });
    return <button onClick={async () => { setSt('saving'); await new Promise(r=>setTimeout(r,5)); setSt('saved'); setT(1); }}>x</button>; }
  const c = await mountC(<S />); log.length = 0;
  c.querySelector('button')!.click(); await tick(60);
  console.log('SAVE', log);
});
test('two microtask setters', async () => {
  const log: string[] = [];
  function S() { const [a,setA]=useState(0), [b,setB]=useState(0); const r = useRef<any>(); r.current = {setA,setB};
    useEffect(()=>{ log.push(`commit ${a} ${b}`); }); (globalThis as any).__s = r; return <i/>; }
  await mountC(<S />); log.length = 0;
  const s = (globalThis as any).__s.current;
  Promise.resolve().then(()=>s.setA(1)); Promise.resolve().then(()=>s.setB(1)); await tick(60);
  console.log('MICRO', log); log.length = 0;
  // native listener
  document.body.addEventListener('click', () => { s.setA(5); s.setB(5); });
  document.body.click(); await tick(60);
  console.log('NATIVE', log);
});
test('render-phase update; different component warning; flushSync in effect', async () => {
  const errs: string[] = []; const o = console.error; console.error = (...a:any[]) => errs.push(String(a[0]).slice(0,110) + ' | ' + String(a[1]||'').slice(0,60));
  const log: string[] = [];
  function R({p}: any) { const [prev,setPrev]=useState(p); const [d,setD]=useState(0); log.push(`render p=${p} prev=${prev}`); if (prev!==p) { setPrev(p); setD(d+1);} useEffect(()=>{ log.push('commit d='+d); }); return <i>{d}</i>; }
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
  root.render(<R p={1}/>); await tick(); log.length=0; root.render(<R p={2}/>); await tick();
  console.log('RENDERPHASE', log);
  let setOther: any;
  function Other() { const [x,setX]=useState(0); setOther=setX; return <b>{x}</b>; }
  function Bad() { setOther?.(1); return <u/>; }
  root.render(<><Other/><Bad/></>); await tick();
  function F() { useEffect(() => { flushSync(() => {}); }, []); return <i/>; }
  root.render(<F/>); await tick();
  console.error = o; console.log('ERRS', errs);
});
