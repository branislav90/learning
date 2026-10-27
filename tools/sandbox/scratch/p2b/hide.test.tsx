import React, { useState, useEffect, useLayoutEffect, Suspense, use, startTransition, Activity } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('suspense hide', async () => {
  const log: string[] = [];
  let resolve!: (v: string) => void;
  const p = new Promise<string>(r => (resolve = r));
  function Slow({ show }: any) { if (show) use(p); useLayoutEffect(() => { log.push('layout mount'); return () => log.push('layout cleanup'); }, []); useEffect(() => { log.push('passive mount'); return () => log.push('passive cleanup'); }, []); return <span id="slow">slow</span>; }
  function App({ show }: any) { return <div><Suspense fallback={<i>fb</i>}><p id="p">kept</p><Slow show={show} /></Suspense></div>; }
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  await act(async () => root.render(<App show={false} />));
  log.push('--- re-suspend urgent');
  await act(async () => root.render(<App show={true} />));
  console.log(c.innerHTML, log);
  await act(async () => { resolve('x'); await p; });
  console.log(c.innerHTML, log);
});
test('activity', async () => {
  const log: string[] = [];
  function Child() { useLayoutEffect(() => { log.push('layout mount'); return () => log.push('layout cleanup'); }, []); useEffect(() => { log.push('passive mount'); return () => log.push('passive cleanup'); }, []); const [n] = useState(() => { log.push('state init'); return 0; }); return <span>child</span>; }
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  await act(async () => root.render(<Activity mode="visible"><Child /></Activity>));
  log.push('--- hidden');
  await act(async () => root.render(<Activity mode="hidden"><Child /></Activity>));
  console.log(c.innerHTML, log);
  log.push('--- visible');
  await act(async () => root.render(<Activity mode="visible"><Child /></Activity>));
  console.log(c.innerHTML, log);
});
test('ref cleanup', async () => {
  const log: string[] = [];
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  await act(async () => root.render(<div ref={(el) => { log.push('attach ' + !!el); return () => log.push('cleanup'); }} />));
  await act(async () => root.render(<span />));
  console.log(log);
});
test('delete subtree one removeChild', async () => {
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  await act(async () => root.render(<div><section><ul><li>1</li><li>2</li></ul></section><p/></div>));
  let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(c, { subtree: true, childList: true });
  await act(async () => root.render(<div><p/></div>));
  console.log(buf.map(r => `${(r.target as Element).tagName} -${r.removedNodes.length} +${r.addedNodes.length}`));
});
test('ContentReset', async () => {
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  await act(async () => root.render(<div>text</div>));
  let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(c, { subtree: true, childList: true, characterData: true });
  await act(async () => root.render(<div><b>x</b></div>));
  console.log(buf.map(r => `${r.type} ${(r.target as Element).nodeName} -${r.removedNodes.length} +${r.addedNodes.length}`), c.innerHTML);
});
test('initial mount single insertion', async () => {
  const c = document.createElement('div'); document.body.appendChild(c);
  let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(c, { subtree: true, childList: true, attributes: true });
  const root = createRoot(c);
  await act(async () => root.render(<table><tbody>{[1,2,3].map(i => <tr key={i}><td className="a">{i}</td></tr>)}</tbody></table>));
  console.log('mount records', buf.map(r => `${r.type} ${(r.target as Element).nodeName} +${r.addedNodes.length}`));
});
