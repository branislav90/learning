import React, { useState, useEffect, useLayoutEffect, Suspense, use, startTransition, lazy, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=40) => new Promise(r => setTimeout(r, ms));
beforeEach(async () => { document.body.innerHTML = ''; await tick(20); });
function mk() { const c = document.createElement('div'); document.body.appendChild(c); return { c, root: createRoot(c) }; }
function deferred<T>() { let res!: (v: T) => void, rej!: (e: any) => void; const p = new Promise<T>((a, b) => { res = a; rej = b; }); return { p, res, rej }; }

test('sibling behavior', async () => {
  const log: string[] = []; const d = deferred<string>(); const dB = deferred<string>();
  function A() { log.push('A start'); const v = use(d.p); log.push('A done'); return <i>{v}</i>; }
  function B() { log.push('B render'); return <b>b</b>; }
  const { c, root } = mk();
  root.render(<Suspense fallback={<u>fb</u>}><A /><B /></Suspense>);
  await tick(50); console.log('SIBLING log', log, c.innerHTML);
  log.length = 0; d.res('x'); await tick(500); console.log('after resolve', log, c.innerHTML);
});
test('state preserved when hidden; first mount state not preserved', async () => {
  const log: string[] = []; let d = deferred<string>(); let setS: any, setShow: any;
  function Inner({ show }: any) { const [s, ss] = useState(() => { log.push('state init'); return 0; }); setS = ss; if (show) use(d.p); return <i id="inner">{s}</i>; }
  function App() { const [show, ss] = useState(false); setShow = ss; return <Suspense fallback={<u>fb</u>}><Inner show={show} /></Suspense>; }
  const { c, root } = mk(); root.render(<App />); await tick(50);
  setS(7); await tick(30); console.log('S=', c.innerHTML);
  setShow(true); await tick(50); console.log('suspended html', c.innerHTML);
  d.res('ok'); await tick(500); console.log('revealed', c.innerHTML, log);
});
test('discrete event suspend no boundary', async () => {
  const d = deferred<string>(); let setS: any;
  function A() { const [s, ss] = useState(false); setS = ss; if (s) use(d.p); return <i>{String(s)}</i>; }
  const { c, root } = mk(); root.render(<A />); await tick(50);
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0,100));
  document.body.addEventListener('click', () => flushSync(() => setS(true))); try { document.body.click(); } catch (e) { errs.push('THROWN ' + (e as any).message); }
  await tick(100); console.error = o; console.log('DISCRETE no boundary html=', c.innerHTML, errs);
  d.res('z'); await tick(100); console.log('after resolve', c.innerHTML);
});
test('root-level suspend no boundary', async () => {
  const d = deferred<string>(); const errs: string[] = [];
  const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 140));
  function A() { use(d.p); return <i>x</i>; }
  const { c, root } = mk();
  let err: any = null;
  const root2 = createRoot(document.createElement('div'), { onUncaughtError: (e) => { err = e; }, onCaughtError: () => {} });
  root.render(<A />); await tick(50); console.log('ROOT default-lane, no boundary: html=', JSON.stringify(c.innerHTML));
  d.res('y'); await tick(50); console.log('after resolve html=', c.innerHTML);
  const d2 = deferred<string>(); function A2() { use(d2.p); return <i>x</i>; }
  const c2 = document.createElement('div'); const root3 = createRoot(c2, { onUncaughtError: (e) => { err = e; } });
  try { flushSync(() => root3.render(<A2 />)); } catch (e) { err = e; }
  await tick(50); console.log('FLUSHSYNC no boundary: err=', String(err?.message).slice(0, 200), 'html=', c2.innerHTML);
  console.error = o; console.log(errs);
});
test('use in try/catch', async () => {
  const d = deferred<string>(); const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 160));
  function A() { try { const v = use(d.p); return <i>{v}</i>; } catch (e) { return <u>caught {String((e as any)?.message)}</u>; } }
  const { c, root } = mk(); root.render(<Suspense fallback="fb"><A /></Suspense>); await tick(50);
  console.error = o; console.log('TRYCATCH html=', c.innerHTML, errs);
});
test('new promise each render', async () => {
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 220));
  let n = 0; function A() { use(new Promise(r => setTimeout(r, 5))); n++; return <i>x</i>; }
  const { c, root } = mk(); root.render(<Suspense fallback="fb"><A /></Suspense>); await tick(1500);
  console.error = o; console.log('NEWPROMISE html=', c.innerHTML, 'renders', n, errs.slice(0,2));
});
test('rejected -> error boundary', async () => {
  const d = deferred<string>();
  class EB extends Component<any, any> { state = { e: null as any }; static getDerivedStateFromError(e: any) { return { e }; } render() { return this.state.e ? <em>err {this.state.e.message}</em> : this.props.children; } }
  function A() { const v = use(d.p); return <i>{v}</i>; }
  const { c, root } = mk(); root.render(<EB><Suspense fallback="fb"><A /></Suspense></EB>); await tick(30); d.rej(new Error('boom')); await tick(500);
  console.log('REJECT html=', c.innerHTML);
});
test('status fields on thenable', async () => {
  const p = Promise.resolve('v') as any; function A() { use(p); return <i>x</i>; }
  const { c, root } = mk(); root.render(<Suspense fallback="fb"><A /></Suspense>); await tick(500);
  console.log('STATUS', p.status, p.value, c.innerHTML);
  const p2 = Promise.resolve('v2') as any; p2.status = 'fulfilled'; p2.value = 'v2';
  function B() { const v = use(p2); return <i>{v}</i>; }
  const r2 = mk(); const log: string[] = []; r2.root.render(<Suspense fallback={<u>fb</u>}><B /></Suspense>);
  await Promise.resolve(); console.log('pre-resolved thenable sync html:', r2.c.innerHTML);
});
test('transition vs fallback', async () => {
  const d = deferred<string>(); let setP: any; const cache = { p: Promise.resolve('0') as Promise<string> } ; (cache.p as any).status='fulfilled'; (cache.p as any).value='0';
  function V({ p }: any) { return <i>{use(p)}</i>; }
  function App() { const [p, sp] = useState(cache.p); setP = sp; return <Suspense fallback={<u>fb</u>}><V p={p} /></Suspense>; }
  const { c, root } = mk(); root.render(<App />); await tick(50);
  const html: string[] = [];
  const mo = new MutationObserver(() => html.push(c.innerHTML)); mo.observe(c, { subtree: true, childList: true, characterData: true, attributes: true });
  startTransition(() => setP(d.p)); await tick(50); console.log('TRANSITION suspended html=', c.innerHTML);
  d.res('1'); await tick(50); console.log('TRANSITION resolved', c.innerHTML);
  const d3 = deferred<string>(); setP(d3.p); await tick(50); console.log('URGENT suspended html=', c.innerHTML);
  d3.res('2'); await tick(500); console.log('URGENT resolved', c.innerHTML);
});
