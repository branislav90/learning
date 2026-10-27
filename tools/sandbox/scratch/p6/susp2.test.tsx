import { Suspense, use } from 'react';
import { render, act } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let t0 = Date.now();
const cache = new Map<string, Promise<string>>(); const started: Record<string, number> = {};
function load(k: string) { if (!cache.has(k)) { started[k] = Date.now()-t0; cache.set(k, new Promise(r => setTimeout(() => r(k), 150))); } return cache.get(k)!; }
function Leaf({ k }: { k: string }) { return <i>{use(load(k))}</i>; }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
test('siblings real timers', async () => {
  t0=Date.now();
  let c!:HTMLElement;
  await act(async()=>{ c=render(<Suspense fallback="fb"><Leaf k="a" /><Leaf k="b" /></Suspense>).container; });
  console.log('after first act: started', JSON.stringify(started), c.textContent);
  await sleep(100); await act(async()=>{});
  console.log('t~100+ started', JSON.stringify(started), c.textContent);
  await sleep(300); await act(async()=>{}); 
  console.log('final', c.textContent, JSON.stringify(started));
});
test('nested', async () => {
  for (const k in started) delete started[k]; cache.clear(); t0=Date.now();
  function Parent() { use(load('pa')); return <Leaf k="child" />; }
  await act(async()=>{ render(<Suspense fallback="fb"><Parent /></Suspense>); });
  await sleep(200); await act(async()=>{}); await sleep(200); await act(async()=>{});
  console.log('nested started', JSON.stringify(started));
});
