import React, { useState, useEffect, useLayoutEffect, Suspense, use, startTransition, lazy, Component } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=40) => new Promise(r => setTimeout(r, ms));
beforeEach(async () => { document.body.innerHTML = ''; await tick(20); });
function mk() { const c = document.createElement('div'); document.body.appendChild(c); return { c, root: createRoot(c) }; }
function delayed<T>(v: T, ms: number) { return new Promise<T>(r => setTimeout(() => r(v), ms)); }

test('nested boundary timeline', async () => {
  const t0 = performance.now(); const events: string[] = [];
  const userP = delayed({name:'Ada'}, 100), postsP = delayed(['p1'], 400);
  function Header() { const u = use(userP); return <h1>{u.name}</h1>; }
  function Posts() { const p = use(postsP); return <ul>{p.map(x => <li key={x}>{x}</li>)}</ul>; }
  const { c, root } = mk();
  const mo = new MutationObserver(() => events.push(`${Math.round(performance.now() - t0)}ms ${c.innerHTML}`)); mo.observe(c, { subtree: true, childList: true });
  root.render(<Suspense fallback={<p>Page skeleton</p>}><Header /><Suspense fallback={<p>Posts skeleton</p>}><Posts /></Suspense></Suspense>);
  await tick(700); console.log('NESTED', events);
});
test('fresh resolved promise', async () => {
  for (const [name, mkp] of [['Promise.resolve', () => Promise.resolve('v')], ['timeout0', () => delayed('v', 0)], ['timeout50', () => delayed('v', 50)]] as const) {
    document.body.innerHTML = '';
    let calls = 0, fbMounts = 0;
    function Fb() { useEffect(() => { fbMounts++; }, []); return <u>fb</u>; }
    function A({ p }: any) { calls++; return <i>{use(p)}</i>; }
    const { c, root } = mk(); const p = mkp();
    root.render(<Suspense fallback={<Fb />}><A p={p} /></Suspense>); await tick(600);
    console.log('FRESH', name, 'calls', calls, 'fallbackMounts', fbMounts, c.innerHTML);
  }
});
test('lab 5.5 effects', async () => {
  const log: string[] = []; let setGate: any;
  function Counter({ gate }: any) { const [n, setN] = useState(0);
    useLayoutEffect(() => { log.push('layout setup'); return () => log.push('layout cleanup'); });
    useEffect(() => { log.push('passive setup'); return () => log.push('passive cleanup'); });
    if (gate) use(gate); return <button id="b" onClick={() => setN(n + 1)}>count {n}</button>; }
  function Lab() { const [gate, sg] = useState<any>(null); setGate = sg; return <Suspense fallback={<p>Loading…</p>}><Counter gate={gate} /></Suspense>; }
  const { c, root } = mk(); root.render(<Lab />); await tick(50);
  c.querySelector<HTMLElement>('#b')!.click(); await tick(30); c.querySelector<HTMLElement>('#b')!.click(); await tick(30);
  log.push('--- suspend'); setGate(delayed(undefined, 400)); await tick(700);
  console.log('LAB', log, c.innerHTML);
});
