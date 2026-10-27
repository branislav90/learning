// @vitest-environment jsdom
import React, { useSyncExternalStore, useMemo } from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { test, afterEach } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
test('uncached', async()=>{
  const errs:string[]=[]; const o=console.error; console.error=(...a:any[])=>errs.push(String(a[0]).slice(0,160));
  let calls=0;
  function C(){ const v=useSyncExternalStore(()=>()=>{}, ()=>{calls++; return {a:1}}); return <p>{v.a}</p> }
  try{ render(<C/>); }catch(e){ errs.push('THROWN '+String(e).slice(0,120)) }
  console.error=o; console.log('uncached', errs, 'calls', calls);
});
test('ssr no server snapshot', ()=>{
  function C(){ const v=useSyncExternalStore(()=>()=>{}, ()=>1); return <p>{v}</p> }
  try{ renderToString(<C/>) }catch(e){ console.log('SSR err:', String(e).slice(0,160)) }
});
test('hydration', async()=>{
  const store={v:true}; const subs=new Set<()=>void>();
  const sub=(f:()=>void)=>{subs.add(f);return()=>subs.delete(f)};
  function C(){ const v=useSyncExternalStore(sub, ()=>store.v, ()=>false); return <p>{String(v)}</p> }
  const html=renderToString(<C/>); const el=document.createElement('div'); el.innerHTML=html; document.body.append(el);
  const errs:any[]=[]; const o=console.error; console.error=(...a:any[])=>errs.push(a[0]);
  await act(async()=>{ hydrateRoot(el,<C/>,{onRecoverableError:(e)=>errs.push('recov '+e)}) });
  console.error=o; console.log('server html', html, 'after hydrate', el.innerHTML, 'errs', errs.length);
});
test('sync update, strict subscribe count', async()=>{
  let n=0; const sub=(f:()=>void)=>{n++; return ()=>{n--}};
  function C(){ useSyncExternalStore(sub, ()=>1, ()=>1); return null }
  render(<React.StrictMode><C/></React.StrictMode>); console.log('active subs after strict mount', n);
});
