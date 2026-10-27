// @vitest-environment jsdom
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, memo } from 'react';
import { createRoot } from 'react-dom/client';
import { it, expect, beforeAll } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
let L: string[] = []; const log = (s: string) => { L.push(s); };
async function mount(el: React.ReactElement) {
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); root.render(el); await sleep(20); return { c, root };
}
it('R1', async () => {
  L = [];
  function Counter({ third }: { third: boolean }) {
    const [n, setN] = useState(0);
    function onClick() { setN(n + 1); setN(n + 1); third ? setN(x => x + 1) : setN(n + 1); log(`handler ${n}`); }
    log(`render ${n}`); return <button onClick={onClick}>{n}</button>;
  }
  const { c } = await mount(<Counter third />); c.querySelector('button')!.click(); await sleep(20);
  console.log('R1a', JSON.stringify(L), c.textContent);
  L = []; const m2 = await mount(<Counter third={false} />); L = []; m2.c.querySelector('button')!.click(); await sleep(20);
  console.log('R1c', JSON.stringify(L), m2.c.textContent);
});
it('R2', async () => {
  function Field({ label }: { label: string }) { const [v, setV] = useState(''); return <label>{label}<input value={v} onChange={e => setV(e.target.value)} /></label>; }
  const A = ({ flip }: any) => flip ? <Field label="B" /> : <Field label="A" />;
  const B = ({ flip }: any) => flip ? <Field key="B" label="B" /> : <Field key="A" label="A" />;
  const C = ({ flip }: any) => flip ? <div><Field label="B" /></div> : <Field label="A" />;
  for (const [name, Comp] of [['A', A], ['B', B], ['C', C]] as const) {
    const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
    root.render(<Comp flip={false} />); await sleep(20);
    const input = c.querySelector('input')!; const label = c.querySelector('label')!;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!; setter.call(input, 'x'); input.dispatchEvent(new Event('input', { bubbles: true })); await sleep(20);
    root.render(<Comp flip={true} />); await sleep(20);
    const i2 = c.querySelector('input')!; const l2 = c.querySelector('label')!;
    console.log('R2', name, l2.textContent, JSON.stringify(i2.value), 'sameInput', i2 === input, 'sameLabel', l2 === label);
  }
});
it('R3', async () => {
  L = [];
  function Child({ id }: { id: number }) {
    useEffect(() => { log(`child effect ${id}`); return () => log(`child cleanup ${id}`); }, [id]);
    useLayoutEffect(() => { log(`child layout ${id}`); return () => log(`child layout cleanup ${id}`); }, [id]);
    log(`child render ${id}`); return null;
  }
  function Parent() {
    const [id, setId] = useState(1);
    useEffect(() => { log('parent effect'); }, []);
    useLayoutEffect(() => { log('parent layout'); }, []);
    log('parent render');
    return (<><button onClick={() => setId(2)}>go</button><Child id={id} /></>);
  }
  const { c } = await mount(<Parent />); console.log('R3a', JSON.stringify(L)); L = [];
  c.querySelector('button')!.click(); await sleep(30); console.log('R3b', JSON.stringify(L));
});
it('R4', async () => {
  function Timer() { const [n, setN] = useState(0); useEffect(() => { const id = setInterval(() => setN(n + 1), 100); return () => clearInterval(id); }, []); return <p>{n}</p>; }
  const { c } = await mount(<Timer />); await sleep(350); console.log('R4', c.textContent); await sleep(500); console.log('R4 later', c.textContent);
});
it('R5', async () => {
  L = [];
  const Child = memo(function Child({ onPick, style }: { onPick: () => void; style?: any }) { log('child'); return <button onClick={onPick}>pick</button>; });
  function Parent({ withStyle }: { withStyle: boolean }) {
    const [n, setN] = useState(0); const stable = useCallback(() => {}, []);
    return (<><button id="ctr" onClick={() => setN(n + 1)}>{n}</button><Child onPick={stable} style={withStyle ? { color: 'red' } : undefined} /><Child onPick={() => {}} /></>);
  }
  const { c } = await mount(<Parent withStyle={false} />); console.log('R5a', JSON.stringify(L)); L = [];
  (c.querySelector('#ctr') as HTMLElement).click(); await sleep(20); console.log('R5b', JSON.stringify(L));
  const m = await mount(<Parent withStyle />); L = []; (m.c.querySelector('#ctr') as HTMLElement).click(); await sleep(20); console.log('R5c', JSON.stringify(L));
});
it('R6', async () => {
  L = [];
  function Demo() {
    const [a, setA] = useState(0), [b, setB] = useState(0), [cc, setC] = useState(0); const renders = useRef(0); renders.current += 1;
    log(`render #${renders.current} a=${a} b=${b} c=${cc}`);
    async function onClick() { setA(1); setB(1); await new Promise(r => setTimeout(r, 0)); setC(1); log('after await'); }
    return <button onClick={onClick}>go</button>;
  }
  const { c } = await mount(<Demo />); c.querySelector('button')!.click(); await sleep(50); console.log('R6', JSON.stringify(L));
});
