import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
function obs(el: Node) { let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(el, { subtree: true, childList: true, attributes: true, characterData: true, attributeOldValue: true, characterDataOldValue: true });
  return () => { buf.push(...mo.takeRecords()); const o = buf; buf = []; return o.map(r => r.type === 'characterData' ? `characterData "${r.oldValue}" -> "${(r.target as any).nodeValue}"` : r.type === 'attributes' ? `attr ${r.attributeName} (was ${JSON.stringify(r.oldValue)}) on ${(r.target as Element).tagName}` : `childList on ${(r.target as Element).tagName} +${r.addedNodes.length} -${r.removedNodes.length}`); }; }
async function m(ui: any) { const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); await act(async () => root.render(ui)); return { c, root }; }
test('text shapes', async () => {
  function T({ n }: any) { return <div><h2>Title</h2><p id="split">Count: {n}</p><p id="single">{`Count: ${n}`}</p><p id="bare">{n}</p><button onClick={() => {}}>+</button></div>; }
  const { c, root } = await m(<T n={0} />);
  console.log('childNodes', ['split','single','bare'].map(id => c.querySelector('#' + id)!.childNodes.length));
  const take = obs(c); const single0 = c.querySelector('#single')!.firstChild;
  await act(async () => root.render(<T n={1} />)); console.log('TEXT SHAPES', take(), 'single node same:', single0 === c.querySelector('#single')!.firstChild);
  await act(async () => root.render(<T n={1} />)); console.log('EQUAL RERENDER', take());
  await act(async () => root.render(<T n={'' as any} />)); console.log('TO EMPTY STRING', take(), c.querySelector('#bare')!.childNodes.length);
  await act(async () => root.render(<T n={5} />)); console.log('EMPTY->TEXT', take());
});
test('table rows', async () => {
  function T({ color, title, cls }: any) { return <div style={{ color, background: 'red' }} title={title} className={cls}>x</div>; }
  const { c, root } = await m(<T color="tomato" title="t" cls="a" />); const take = obs(c);
  await act(async () => root.render(<T color="blue" title="t" cls="a" />)); console.log('STYLE ONE PROP', take(), (c.firstChild as HTMLElement).getAttribute('style'));
  await act(async () => root.render(<T color="blue" title={undefined} cls="a" />)); console.log('PROP REMOVED', take());
  await act(async () => root.render(<T color="blue" title="z" cls="b" />)); console.log('TITLE+CLASS', take());
  await act(async () => root.render(<T color="blue" title="z" cls="b" />)); console.log('NOTHING', take());
});
test('batched 1,2,3', async () => {
  let set: any; function T() { const [n, s] = useState(0); set = s; return <p>{n}</p>; }
  const { c } = await m(<T />); const take = obs(c);
  await act(async () => { set(1); set(2); set(3); }); console.log('BATCH', take());
});
