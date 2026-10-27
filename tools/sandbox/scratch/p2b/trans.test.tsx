import React, { useState, useEffect, useTransition, useDeferredValue, memo, Suspense, use, startTransition, useRef } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=40) => new Promise(r => setTimeout(r, ms));
const spin = (ms: number) => { const t = performance.now(); while (performance.now() - t < ms); };
async function mountC(ui: any) { const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); root.render(ui); await tick(120); return {c, root}; }
beforeEach(async () => { document.body.innerHTML = ''; await tick(50); });

test('tab switch w/ transition, then second click mid-render', async () => {
  const log: string[] = [];
  function Post({i}: any) { spin(1); return <li>{i}</li>; }
  function SlowPosts() { log.push('SlowPosts render start'); return <ul>{Array.from({length: 200}, (_, i) => <Post key={i} i={i} />)}</ul>; }
  function Tabs() { const [tab, setTab] = useState('about'); const [isPending, st] = useTransition();
    log.push(`Tabs render tab=${tab} pending=${isPending}`);
    useEffect(() => { log.push(`COMMIT tab=${tab} pending=${isPending}`); });
    return <div><button id="posts" onClick={() => st(() => setTab('posts'))}>p</button><button id="contact" onClick={() => st(() => setTab('contact'))}>c</button>
      {tab === 'about' && <p>about</p>}{tab === 'posts' && <SlowPosts />}{tab === 'contact' && <p>contact</p>}</div>; }
  const { c } = await mountC(<Tabs />); log.length = 0;
  c.querySelector<HTMLElement>('#posts')!.click();
  await tick(5); log.push('--- 5ms later (task boundary)'); 
  await tick(400);
  console.log('SINGLE CLICK', log); log.length = 0;
});
test('tab switch two clicks', async () => {
  const log: string[] = [];
  function Post({i}: any) { spin(1); return <li>{i}</li>; }
  function SlowPosts() { log.push('SlowPosts render start'); return <ul>{Array.from({length: 300}, (_, i) => <Post key={i} i={i} />)}</ul>; }
  function Tabs() { const [tab, setTab] = useState('about'); const [isPending, st] = useTransition();
    log.push(`Tabs render tab=${tab} pending=${isPending}`);
    useEffect(() => { log.push(`COMMIT tab=${tab} pending=${isPending}; dom=${document.body.innerHTML.includes('<li>') ? 'posts' : 'other'}`); });
    return <div><button id="posts" onClick={() => st(() => setTab('posts'))}>p</button><button id="contact" onClick={() => st(() => setTab('contact'))}>c</button>
      {tab === 'about' && <p>about</p>}{tab === 'posts' && <SlowPosts />}{tab === 'contact' && <p>contact</p>}</div>; }
  const { c } = await mountC(<Tabs />); log.length = 0;
  c.querySelector<HTMLElement>('#posts')!.click();
  setTimeout(() => { log.push('--- click contact'); c.querySelector<HTMLElement>('#contact')!.click(); }, 20);
  await tick(800);
  console.log('TWO CLICKS', log);
});
test('rebase example', async () => {
  const log: string[] = []; let set: any; let st: any;
  function C() { const [c, setC] = useState(1); const [, startT] = useTransition(); set = setC; st = startT; log.push('render ' + c); return <i>{c}</i>; }
  const { c } = await mountC(<C />); log.length = 0;
  const ev = () => { st(() => set((x: number) => x + 1)); set((x: number) => x * 2); };
  document.body.addEventListener('click', ev); document.body.click();
  await tick(100); console.log('REBASE', log, c.textContent);
});
test('deferred', async () => {
  const log: string[] = [];
  const Results = memo(function Results({ q }: any) { log.push('Results q=' + JSON.stringify(q)); spin(30); return <ul>{q}</ul>; });
  let setQ: any;
  function S() { const [q, sq] = useState(''); setQ = sq; const d = useDeferredValue(q); log.push(`S q=${q} d=${d}`); return <div><Results q={d} /></div>; }
  const { c } = await mountC(<S />); log.length = 0;
  document.body.addEventListener('click', () => setQ('a')); document.body.click();
  await tick(150); console.log('DEFERRED', log);
  log.length = 0;
  // initialValue
  function S2() { const d = useDeferredValue('final', 'init'); log.push('S2 d=' + d); return <i>{d}</i>; }
  const o = await mountC(<S2 />); console.log('INITIAL', log, o.c.textContent);
  log.length = 0;
  // inside transition returns new value
  let st: any;
  function S3() { const [q, sq] = useState('x'); setQ = sq; const [, t] = useTransition(); st = t; const d = useDeferredValue(q); log.push(`S3 q=${q} d=${d}`); return <i>{d}</i>; }
  await mountC(<S3 />); log.length = 0;
  st(() => setQ('y')); await tick(100); console.log('DEFERRED IN TRANSITION', log);
});
test('async action isPending', async () => {
  const log: string[] = []; let st: any, set: any;
  function A() { const [v, setV] = useState(0); const [p, t] = useTransition(); st = t; set = setV; log.push(`A v=${v} pending=${p}`); return <i>{v}</i>; }
  await mountC(<A />); log.length = 0;
  document.body.addEventListener('click', () => st(async () => { await new Promise(r => setTimeout(r, 20)); st(() => set(5)); })); document.body.click();
  await tick(100); console.log('ASYNC ACTION', log);
});
