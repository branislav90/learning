import React, { useState, useEffect, useLayoutEffect, memo, useDeferredValue, Suspense, use, useTransition, useId } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms = 60) => new Promise(r => setTimeout(r, ms));
const LOG: string[] = []; const L = (...a: any[]) => LOG.push(a.join(' '));
beforeEach(async () => { document.body.innerHTML = ''; LOG.length = 0; await tick(10); });
function mk() { const c = document.createElement('div'); document.body.appendChild(c); return { c, root: createRoot(c) }; }
test('R1', async () => {
  function Child({ n }: { n: number }) { L('Child render', n); useLayoutEffect(() => { L('Child layout', n); return () => L('Child layout cleanup', n); }); useEffect(() => { L('Child effect', n); return () => L('Child effect cleanup', n); }); return <span>{n}</span>; }
  function Parent() { const [n, setN] = useState(0); L('Parent render', n); useLayoutEffect(() => { L('Parent layout', n); }); useEffect(() => { L('Parent effect', n); if (n === 0) setN(1); }); return <Child n={n} />; }
  mk().root.render(<Parent />); await tick(100); console.log('R1\n' + LOG.join('\n'));
});
test('R2', async () => {
  function Counter() { const [c, setC] = useState(0); L('render', c); return <button onClick={() => { setC(c + 1); setC(c + 1); setC((x) => x + 1); L('handler sees', c); setTimeout(() => { setC((x) => x + 10); L('timeout sees', c); }, 0); }}>{c}</button>; }
  const { c, root } = mk(); root.render(<Counter />); await tick(100); c.querySelector('button')!.click(); await tick(100); console.log('R2\n' + LOG.join('\n') + '\nfinal: ' + c.textContent);
});
test('R3', async () => {
  for (const strat of ['index', 'label', 'random']) {
    LOG.length = 0;
    function Row({ label }: any) { const [note, setNote] = useState(''); L('Row render', label); return <li><span>{label}</span><input value={note} onChange={(e) => setNote(e.target.value)} aria-label={`note ${label}`} /></li>; }
    function List({ items }: any) { return <ul>{items.map((l: string, i: number) => <Row key={strat === 'index' ? i : strat === 'label' ? l : Math.random()} label={l} />)}</ul>; }
    const { c, root } = mk(); root.render(<List items={['A', 'B', 'C']} />); await tick(60);
    const input = c.querySelector('input')!; input.focus(); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'x'); input.dispatchEvent(new Event('input', { bubbles: true })); await tick(30);
    LOG.length = 0; let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(c, { subtree: true, childList: true, characterData: true });
    root.render(<List items={['C', 'B', 'A']} />); await tick(60); buf.push(...mo.takeRecords());
    const lis = [...c.querySelectorAll('li')].map(li => li.querySelector('span')!.textContent + ':' + (li.querySelector('input') as HTMLInputElement).value);
    console.log('R3', strat, LOG.join(' | '), '| DOM', lis.join(' '), '| removed', buf.flatMap(r => [...r.removedNodes]).map(n => n.nodeName + (n.textContent||'')).join(','), '| added', buf.flatMap(r => [...r.addedNodes]).map(n => n.nodeName).join(','), '| chars', buf.filter(r => r.type === 'characterData').length, '| focus in doc input:', document.activeElement === c.querySelector('input'), document.activeElement?.getAttribute('aria-label'));
  }
});
test('R4', async () => {
  const List = memo(function List({ q }: any) { L('List q=' + q); const t = performance.now(); while (performance.now() - t < 60); return <ul><li>{q}</li></ul>; });
  let setQ: any;
  function Search() { const [q, sq] = useState(''); setQ = sq; const d = useDeferredValue(q); L(`Search q=${q} d=${d}`); return <><input value={q} onChange={(e) => sq(e.target.value)} /><List q={d} /></>; }
  const { c, root } = mk(); root.render(<Search />); await tick(200); console.log('R4a', LOG.join(' | ')); LOG.length = 0;
  const input = c.querySelector('input')!; const type = (v: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true })); };
  type('a'); await tick(300); console.log('R4b', LOG.join(' | ')); LOG.length = 0;
  type('ab'); setTimeout(() => { LOG.push('-- type c'); type('abc'); }, 20); await tick(500); console.log('R4c (typed 2nd key while List mid-render ~20ms)', LOG.join(' | '));
});
test('R5', async () => {
  const cache = new Map<string, Promise<string>>();
  function getData(id: string) { let p = cache.get(id); if (!p) { p = new Promise((r) => setTimeout(() => r(`data ${id}`), 1000)); cache.set(id, p); } return p; }
  const p1 = Promise.resolve('data 1') as any; p1.status = 'fulfilled'; p1.value = 'data 1'; cache.set('1', p1);
  function Panel({ id }: any) { const data = use(getData(id)); return <section><p>{data}</p><input aria-label="note" defaultValue="" /></section>; }
  let commits = 0;
  function App() { const [id, setId] = useState('1'); const [isPending, startTransition] = useTransition(); useEffect(() => { commits++; }); return <><button id="u" onClick={() => setId('2')}>urgent</button><button id="t" onClick={() => startTransition(() => setId('2'))}>transition</button><Suspense fallback={<p>loading</p>}><Panel id={id} /></Suspense>{isPending && <p role="status">updating</p>}</>; }
  for (const which of ['u', 't']) {
    cache.delete('2'); document.body.innerHTML = '';
    const { c, root } = mk(); root.render(<App />); await tick(100);
    const input = c.querySelector('input')!; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'hi'); 
    input.value = 'hi'; commits = 0;
    (c.querySelector('#' + which) as HTMLElement).click(); await tick(500);
    console.log('R5', which, 'at 500ms: commits', commits, c.innerHTML.replace(/<button[^>]*>[^<]*<\/button>/g, ''));
    await tick(1300); console.log('R5', which, 'after load: commits', commits, c.innerHTML.replace(/<button[^>]*>[^<]*<\/button>/g, ''), 'input value:', (c.querySelector('input') as HTMLInputElement).value, 'same node:', c.querySelector('input') === input);
  }
}, 15000);
test('R6', async () => {
  const run = async (name: string, el: () => any) => { const c = document.createElement('div'); c.innerHTML = renderToString(el()); document.body.append(c); const before = c.innerHTML; const errs: string[] = []; const o = console.error; const w: string[] = []; console.error = (...a: any[]) => w.push(String(a[0]).slice(0, 50));
    hydrateRoot(c, el(), { onRecoverableError: (e: any) => errs.push(e.message.slice(0, 40)) }); await tick(100); console.error = o; console.log('R6', name, '| before:', before, '| after:', c.innerHTML, '| recoverable:', errs.length, '| console.error:', w.length); };
  await run('1 random text', () => <p>{Math.random()}</p>);
  await run('2 random id', () => <div id={String(Math.random())}>x</div>);
  function F() { const id = useId(); return <><label htmlFor={id}>L</label><input id={id} /></>; }
  await run('3 useId', () => <F />);
  function G() { const [m, setM] = useState(false); useEffect(() => setM(true), []); return <p>{m ? 'client' : 'server'}</p>; }
  await run('4 two-pass', () => <G />);
});
