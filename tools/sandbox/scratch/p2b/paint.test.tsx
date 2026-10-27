import React, { useState, useEffect, useLayoutEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { renderToString } from 'react-dom/server';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=30) => new Promise(r => setTimeout(r, ms));
test('discrete click order', async () => {
  const log: string[] = [];
  let setter: any;
  function P() { const [n, setN] = useState(0); setter = setN; log.push('render ' + n);
    useLayoutEffect(() => { log.push('layout ' + n); requestAnimationFrame(() => log.push('rAF ' + n)); }, [n]);
    useEffect(() => { log.push('passive ' + n); }, [n]);
    return <button onClick={() => { log.push('handler'); setN(x => x + 1); log.push('handler end'); }}>c{n}</button>; }
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c); root.render(<P />); await tick(50);
  log.length = 0;
  c.querySelector('button')!.click();
  log.push('after click() returns (sync)');
  await tick(50);
  console.log('CLICK', log);
  log.length = 0;
  setTimeout(() => { setter((x: number) => x + 1); log.push('timer end'); }, 0);
  await tick(80);
  console.log('TIMER', log);
});
test('strict mode click', async () => {
  const log: string[] = [];
  function P() { const [n, setN] = useState(0); log.push('render ' + n);
    useEffect(() => { log.push('passive ' + n); return () => log.push('cleanup ' + n); }, [n]);
    return <button onClick={() => setN(x => x + 1)}>c{n}</button>; }
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c); root.render(<StrictMode><P /></StrictMode>); await tick(50);
  console.log('STRICT MOUNT', [...log]); log.length = 0;
  c.querySelector('button')!.click(); await tick(50);
  console.log('STRICT CLICK', log);
});
test('flushSync passive', async () => {
  const log: string[] = [];
  let setter: any;
  function P() { const [n, setN] = useState(0); setter = setN; useEffect(() => { log.push('passive ' + n); }, [n]); useLayoutEffect(() => { log.push('layout ' + n); }, [n]); return <i>{n}</i>; }
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c); root.render(<P />); await tick(50); log.length = 0;
  flushSync(() => setter(1));
  log.push('after flushSync');
  await tick(30);
  console.log('FLUSHSYNC (called from test, no event)', log);
});
test('ssr layout effect warning', async () => {
  const spy: any[] = []; const o = console.error; console.error = (...a: any[]) => spy.push(a.join(' ').slice(0,120));
  function P() { useLayoutEffect(() => {}, []); return <i>x</i>; }
  renderToString(<P />); console.error = o;
  console.log('SSR layout warning:', spy);
});
