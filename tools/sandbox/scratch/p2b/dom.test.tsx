import React, { useState, useEffect, useLayoutEffect, StrictMode, act, Suspense, use, startTransition } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function observe(el: Node) {
  const recs: string[] = [];
  const mo = new MutationObserver(list => { for (const r of list) {
    const d = (n: Node) => n.nodeType === 3 ? `#text(${n.nodeValue})` : (n as Element).outerHTML?.slice(0,40);
    if (r.type === 'childList') recs.push(`childList on <${(r.target as Element).tagName}> +[${[...r.addedNodes].map(d)}] -[${[...r.removedNodes].map(d)}]`);
    else if (r.type === 'attributes') recs.push(`attr ${r.attributeName} on <${(r.target as Element).tagName}>`);
    else recs.push(`characterData -> ${(r.target as any).nodeValue}`);
  }});
  mo.observe(el, { subtree: true, childList: true, attributes: true, characterData: true });
  return { flush: () => { const t = mo.takeRecords(); (mo as any)._h?.(t); }, recs, mo };
}
// takeRecords returns records; wrap
function obs(el: Node) {
  let buf: MutationRecord[] = [];
  const mo = new MutationObserver((l) => { buf.push(...l); });
  mo.observe(el, { subtree: true, childList: true, attributes: true, characterData: true });
  return () => { buf.push(...mo.takeRecords()); const out = buf; buf = []; return out.map(r => {
    const d = (n: Node) => n.nodeType === 3 ? `#text(${n.nodeValue})` : (n as Element).outerHTML?.slice(0,30);
    if (r.type === 'childList') return `childList <${(r.target as Element).tagName}> +[${[...r.addedNodes].map(d)}] -[${[...r.removedNodes].map(d)}]`;
    if (r.type === 'attributes') return `attr ${r.attributeName} <${(r.target as Element).tagName}>`;
    return `characterData -> ${(r.target as any).nodeValue}`;
  }); };
}

async function mount(ui: React.ReactElement) {
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  await act(async () => root.render(ui));
  return { c, root };
}

test('keyed reorder', async () => {
  const L = ({ items }: { items: string[] }) => <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
  const { c, root } = await mount(<L items={['a','b','c','d']} />);
  const take = obs(c);
  await act(async () => root.render(<L items={['d','a','b','c']} />));
  console.log('MOVE LAST TO FIRST', take());
  await act(async () => root.render(<L items={['a','b','c','d']} />));
  take();
  await act(async () => root.render(<L items={['b','a','c','d']} />));
  console.log('SWAP FIRST TWO', take());
  await act(async () => root.render(<L items={['b','a','c']} />));
  console.log('REMOVE d', take());
  await act(async () => root.render(<L items={['x','b','a','c']} />));
  console.log('INSERT x at front', take());
  await act(async () => root.render(<L items={['c','a','b','x']} />));
  console.log('REVERSE-ish', take());
});
test('unkeyed / index keys insert front', async () => {
  const L = ({ items }: { items: string[] }) => <ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>;
  const { c, root } = await mount(<L items={['a','b','c']} />);
  const take = obs(c);
  await act(async () => root.render(<L items={['x','a','b','c']} />));
  console.log('INDEX KEY insert front', take());
});
test('text update / same text / attr / type change / key change', async () => {
  const A = ({ t, cls }: { t: string; cls?: string }) => <div className={cls}><h3>Static</h3><p>{t}</p></div>;
  const { c, root } = await mount(<A t="hello" cls="x" />);
  const take = obs(c);
  await act(async () => root.render(<A t="world" cls="x" />));
  console.log('TEXT CHANGE', take());
  await act(async () => root.render(<A t="world" cls="x" />));
  console.log('SAME', take());
  await act(async () => root.render(<A t="world" cls="y" />));
  console.log('CLASS CHANGE', take());
  await act(async () => root.render(<A t="world" />));
  console.log('CLASS REMOVED', take());
  await act(async () => root.render(<div key="k1"><A t="world"/></div>));
  console.log('WRAP', take());
  const P = ({ k, tag }: { k: string; tag: 'div'|'section' }) => { const T = tag as any; return <T key={k}>hi</T>; };
  await act(async () => root.render(<P k="1" tag="div" />)); take();
  await act(async () => root.render(<P k="2" tag="div" />));
  console.log('KEY CHANGE', take());
  await act(async () => root.render(<P k="2" tag="section" />));
  console.log('TYPE CHANGE', take());
});
test('text child numbers: {a}{b} two text nodes', async () => {
  const A = ({ a, b }: any) => <p>Hello {a}, you have {b} items</p>;
  const { c, root } = await mount(<A a="Bob" b={3} />);
  console.log('childNodes', c.querySelector('p')!.childNodes.length);
  const take = obs(c);
  await act(async () => root.render(<A a="Bob" b={4} />));
  console.log('ONE OF TEXT', take());
});
test('commit order of mutation: children ordering of cond sibling', async () => {
  const A = ({ s }: any) => <div>{s && <span>s</span>}<b>b</b></div>;
  const { c, root } = await mount(<A s={false} />);
  const take = obs(c);
  await act(async () => root.render(<A s={true} />));
  console.log('COND INSERT', take(), c.innerHTML);
});
test('input value property vs attribute', async () => {
  const A = ({ v }: any) => <input value={v} onChange={() => {}} />;
  const { c, root } = await mount(<A v="a" />);
  const take = obs(c);
  await act(async () => root.render(<A v="b" />));
  console.log('INPUT VALUE', take(), (c.firstChild as any).value, (c.firstChild as HTMLElement).getAttribute('value'));
});
