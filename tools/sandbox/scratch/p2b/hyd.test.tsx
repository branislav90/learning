import React, { useState, useEffect, useLayoutEffect, Suspense, lazy, useId, useSyncExternalStore, use } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=60) => new Promise(r => setTimeout(r, ms));
beforeEach(async () => { document.body.innerHTML = ''; await tick(20); });
async function hydrate(serverEl: any, clientEl: any) {
  const c = document.createElement('div'); document.body.appendChild(c); c.innerHTML = renderToString(serverEl);
  const errs: string[] = []; const rec: string[] = [];
  const o = console.error; console.error = (...a: any[]) => errs.push(a.map(String).join(' ').slice(0, 700));
  const before = c.innerHTML; const nodeBefore = c.firstElementChild;
  const root = hydrateRoot(c, clientEl, { onRecoverableError: (e: any, info: any) => rec.push(String(e?.message).slice(0, 300) + ' ## ' + String(info?.componentStack||'').slice(0,100)) });
  await tick(100); console.error = o;
  return { c, before, same: nodeBefore === c.firstElementChild, errs, rec, root };
}
const S = (x: any) => ({ x });
test('text mismatch', async () => {
  const r = await hydrate(<div><p>server</p><b>keep</b></div>, <div><p>client</p><b>keep</b></div>);
  console.log('TEXT MISMATCH html:', r.c.innerHTML, 'domNodeReused:', r.same, '\nrecoverable:', r.rec, '\nconsole.error:', r.errs);
});
test('attr mismatch', async () => {
  const r = await hydrate(<div className="s"><p>t</p></div>, <div className="c"><p>t</p></div>);
  console.log('ATTR MISMATCH html:', r.c.innerHTML, 'reused:', r.same, '\nrecoverable:', r.rec, '\nconsole.error:', r.errs);
});
test('tag mismatch no boundary', async () => {
  const r = await hydrate(<div><span>t</span></div>, <div><p>t</p></div>);
  console.log('TAG MISMATCH html:', r.c.innerHTML, 'reused:', r.same, '\nrecoverable:', r.rec, '\nconsole.error:', r.errs.map(e => e.slice(0,200)));
});
test('mismatch inside Suspense', async () => {
  const r = await hydrate(<div><h1>outer</h1><Suspense fallback="fb"><p>server</p></Suspense><i>after</i></div>, <div><h1>outer</h1><Suspense fallback="fb"><span>client</span></Suspense><i>after</i></div>);
  const c = r.c; console.log('SUSPENSE MISMATCH html:', c.innerHTML, 'h1 reused?', r.same, '\nrecoverable:', r.rec);
});
test('suppressHydrationWarning text', async () => {
  const r = await hydrate(<div><time suppressHydrationWarning>server</time></div>, <div><time suppressHydrationWarning>client</time></div>);
  console.log('SUPPRESS html:', r.c.innerHTML, '\nrecoverable:', r.rec, 'console.error:', r.errs);
});
test('effects and useId', async () => {
  const log: string[] = [];
  function A() { const id = useId(); useEffect(() => { log.push('effect'); }, []); useLayoutEffect(() => { log.push('layout'); }, []); log.push('render'); return <label htmlFor={id}>{id}</label>; }
  const r = await hydrate(<A />, <A />);
  console.log('EFFECT/ID', log, r.before, '->', r.c.innerHTML, r.errs);
});
test('two-pass / getServerSnapshot', async () => {
  const sub = () => () => {};
  function A() { const v = useSyncExternalStore(sub, () => 'client', () => 'server'); const [m, setM] = useState(false); useEffect(() => setM(true), []); return <div>{v}{m ? '!' : ''}</div>; }
  const r = await hydrate(<A />, <A />);
  console.log('GSS html', r.c.innerHTML, r.rec, r.errs);
});
test('event replay & selective hydration', async () => {
  let release!: () => void; const gate = new Promise<void>(r => (release = r));
  const clicks: string[] = [];
  const Lazy = lazy(async () => { await gate; return { default: () => <button id="lb" onClick={() => clicks.push('lazy click')}>lazy</button> }; });
  const Server = () => <div><Suspense fallback="fb"><button id="lb">lazy</button></Suspense></div>;
  const c = document.createElement('div'); document.body.appendChild(c); c.innerHTML = renderToString(<Server />);
  const rec: string[] = [];
  hydrateRoot(c, <div><Suspense fallback="fb"><Lazy /></Suspense></div>, { onRecoverableError: (e: any) => rec.push(String(e.message)) });
  await tick(100);
  console.log('before release html:', c.innerHTML);
  c.querySelector<HTMLElement>('#lb')!.click(); clicks.push('--- clicked before hydrated');
  await tick(50); release(); await tick(400);
  console.log('REPLAY clicks:', clicks, 'html:', c.innerHTML, rec);
});
