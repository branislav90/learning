import React, { useState, memo, createContext, useContext, Profiler } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
async function m(ui: any) { const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); await act(async () => root.render(ui)); return { c, root }; }
test('same-state bailout', async () => {
  const log: string[] = []; let set: any;
  const Child = () => { log.push('Child'); return <i/>; };
  function P() { const [n, setN] = useState(0); set = setN; log.push('P render n=' + n); return <div><Child /></div>; }
  await m(<P />); log.length = 0;
  await act(async () => set(0)); console.log('SET SAME (first, fresh)', log.slice()); log.length = 0;
  await act(async () => set(1)); log.length = 0;
  await act(async () => set(1)); console.log('SET SAME after update', log.slice()); log.length = 0;
  await act(async () => set(1)); console.log('SET SAME again', log.slice());
});
test('B1/B3/B4', async () => {
  const log: string[] = [];
  const C = memo(function C() { log.push('C'); return <i/>; });
  function P() { const [a, setA] = useState(0); return <><button onClick={() => setA(a + 1)} /><C /></>; }
  const { c } = await m(<P />); log.length = 0; await act(async () => c.querySelector('button')!.click()); console.log('B1', log.slice());
  log.length = 0;
  const B = memo(function B({ n }: any) { log.push('B'); return <i>{n}</i>; });
  function A() { const [n, setN] = useState(0); return <><button onClick={() => setN(n + 1)} /><B n={n} fixed={{ x: 1 }} /></>; }
  const r = await m(<A />); log.length = 0; await act(async () => r.c.querySelector('button')!.click()); console.log('B3', log.slice());
  log.length = 0;
  const Ctx = createContext({ u: 1 }); const Cons = () => { useContext(Ctx); log.push('Cons'); return <i/>; };
  const Mid = memo(() => <Cons />);
  function Prov() { const [n, setN] = useState(0); return <Ctx.Provider value={{ u: 1 }}><button onClick={() => setN(n + 1)} /><Mid /></Ctx.Provider>; }
  const r2 = await m(<Prov />); log.length = 0; await act(async () => r2.c.querySelector('button')!.click()); console.log('B4', log.slice());
});
test('profiler onRender', async () => {
  const calls: any[] = []; let set: any; function X() { const [n, s] = useState(0); set = s; return <i>{n}</i>; }
  await m(<Profiler id="p" onRender={(...a) => calls.push(a.slice(0, 3))}><X /></Profiler>);
  await act(async () => set(1)); console.log('PROFILER', calls.map(c => [c[0], c[1], typeof c[2]]));
});
