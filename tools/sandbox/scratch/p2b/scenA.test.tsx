import React, { useState, memo, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
const logs: string[] = [];
const counters: Record<string, number> = {};
const mark = (n: string) => { counters[n] = (counters[n] ?? 0) + 1; logs.push(`render ${n} (#${counters[n]})`); };
function DomLog({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const root = ref.current!; const mo = new MutationObserver((records) => { for (const r of records) { if (r.type === 'characterData') logs.push(`[dom] characterData ${JSON.stringify(r.oldValue)} -> ${JSON.stringify(r.target.nodeValue)}`); else if (r.type === 'attributes') logs.push(`[dom] attribute ${r.attributeName}`); else logs.push('[dom] childList'); } });
    mo.observe(root, { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true }); return () => mo.disconnect(); }, []);
  return <div ref={ref}>{children}</div>;
}
function ChildV0({ title }: { title: string }) { mark('Child'); return <article className="card" style={{ padding: 8 }} data-testid="child"><h3>{title}</h3><p>x</p></article>; }
function ParentV0() { const [n, setN] = useState(0); mark('Parent'); return <DomLog><section><button onClick={() => setN(x => x + 1)}>count: {n}</button><ChildV0 title="Static" /></section></DomLog>; }
const ChildM = memo(ChildV0);
function ParentV1() { const [n, setN] = useState(0); mark('Parent'); return <DomLog><section><button onClick={() => setN(x => x + 1)}>count: {n}</button><ChildM title="Static" /></section></DomLog>; }
function CounterShell({ children }: { children: ReactNode }) { const [n, setN] = useState(0); mark('CounterShell'); return <section><button onClick={() => setN(x => x + 1)}>count: {n}</button>{children}</section>; }
function App() { mark('App'); return <CounterShell><ChildV0 title="Static" /></CounterShell>; }
function CounterButton() { const [n, setN] = useState(0); mark('CounterButton'); return <button onClick={() => setN(x => x + 1)}>count: {n}</button>; }
function ParentV3() { mark('Parent'); return <section><CounterButton /><ChildV0 title="Static" /></section>; }
const ChildS = memo(function Child({ style }: any) { mark('Child'); return <article style={style}><h3>Static</h3></article>; });
function ParentBad() { const [n, setN] = useState(0); return <section><button onClick={() => setN(x => x + 1)}>count: {n}</button><ChildS style={{ padding: 8 }} /></section>; }
const Panel = memo(function Panel({ children }: any) { mark('Panel'); return <aside>{children}</aside>; });
function ParentC() { const [n, setN] = useState(0); return <><button onClick={() => setN(x => x + 1)}>{n}</button><Panel><span>hello</span></Panel></>; }
async function clickOnce(ui: any) { logs.length = 0; for (const k of Object.keys(counters)) delete counters[k]; const r = render(ui); logs.length = 0; await userEvent.click(r.container.querySelector('button')!); await act(async () => {}); const out = [...logs]; r.unmount(); return out; }
test('variants', async () => {
  console.log('V0', await clickOnce(<ParentV0 />));
  console.log('V1', await clickOnce(<ParentV1 />));
  console.log('V2', await clickOnce(<App />));
  console.log('V3', await clickOnce(<ParentV3 />));
  console.log('BAD', await clickOnce(<ParentBad />));
  console.log('PANEL', await clickOnce(<ParentC />));
});
const childRender = vi.fn();
function Child({ title }: { title: string }) { childRender(); return <article data-testid="child"><h3>{title}</h3></article>; }
function Parent() { const [n, setN] = useState(0); return <section><button onClick={() => setN((x) => x + 1)}>count: {n}</button><Child title="Static" /></section>; }
it('lesson 5.8 test', async () => {
  render(<Parent />); const childNode = screen.getByTestId('child'); const records: MutationRecord[] = [];
  const mo = new MutationObserver((r) => records.push(...r)); mo.observe(childNode, { subtree: true, childList: true, attributes: true, characterData: true });
  childRender.mockClear(); await userEvent.click(screen.getByRole('button')); records.push(...mo.takeRecords()); mo.disconnect();
  expect(childRender).toHaveBeenCalledTimes(1); expect(records).toHaveLength(0); expect(screen.getByTestId('child')).toBe(childNode); expect(screen.getByRole('button').textContent).toBe('count: 1');
});
