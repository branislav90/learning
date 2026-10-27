// @vitest-environment jsdom
import { test, afterEach } from 'vitest';
import React, { StrictMode, useState, useEffect, useReducer, useSyncExternalStore, Children, act } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
async function mount(el: React.ReactElement) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(el)); return { host, root }; }
test('P1', async () => {
  let n = 0; const log: string[] = [];
  function Expensive() { n++; return <p>static</p>; }
  function Clock({ children }: { children: React.ReactNode }) { const [t, setT] = useState(0); useEffect(() => { const id = setInterval(() => setT(x => x + 1), 10); return () => clearInterval(id); }, []); return <div>{t}{children}</div>; }
  function App() { return <Clock><Expensive /></Clock>; }
  const { root } = await mount(<StrictMode><App /></StrictMode>);
  await act(async () => { await new Promise(r => setTimeout(r, 80)); });
  console.log('P1 strict Expensive renders', n); await act(async () => root.unmount());
});
test('P2', async () => {
  type S = { items: string[] };
  function reducer(state: S, action: { type: 'add'; item: string }): S { state.items.push(action.item); return { items: state.items }; }
  function List() { const [s, dispatch] = useReducer(reducer, { items: [] }); return <><button onClick={() => dispatch({ type: 'add', item: 'a' })}>add</button><ul>{s.items.map((x, i) => <li key={i}>{x}</li>)}</ul></>; }
  for (const strict of [true, false]) {
    const { host } = await mount(strict ? <StrictMode><List /></StrictMode> : <List />);
    await act(async () => { host.querySelector('button')!.click(); });
    console.log('P2 strict=' + strict, 'li count', host.querySelectorAll('li').length);
  }
});
test('P3', async () => {
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).replace(/%s/g, '').slice(0, 140));
  function Name() { const [name, setName] = useState<string>(); return <input value={name} onChange={(e) => setName(e.target.value)} />; }
  const { host } = await mount(<Name />);
  const input = host.querySelector('input')!;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  await act(async () => { setter.call(input, 'a'); input.dispatchEvent(new Event('input', { bubbles: true })); });
  console.error = o; console.log('P3', errs);
});
test('P4', async () => {
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 120));
  function useSize() { return useSyncExternalStore((cb) => { window.addEventListener('resize', cb); return () => window.removeEventListener('resize', cb); }, () => ({ width: window.innerWidth })); }
  function C() { return <i>{useSize().width}</i>; }
  try { await mount(<C />); console.log('P4 mounted'); } catch (e: any) { console.log('P4 threw', e.message.slice(0, 80)); }
  console.error = o; console.log('P4 errs', errs.slice(0, 2));
});
test('P5', async () => {
  function Layout({ children }: { children: React.ReactNode }) {
    const kids = Children.toArray(children) as React.ReactElement[];
    const header = kids.find((k) => k.type === (Layout as any).Header);
    const rest = kids.filter((k) => k !== header);
    return <div><header>{header}</header><main>{rest}</main></div>;
  }
  (Layout as any).Header = ({ children }: any) => <h1>{children}</h1>;
  function AppHeader() { return <Layout.Header>Hi</Layout.Header>; }
  const { host } = await mount(<Layout><AppHeader /><p>Body</p></Layout>);
  console.log('P5', host.innerHTML);
});
test('P6', async () => {
  for (const strict of [true, false]) {
    const log: string[] = [];
    class Socket { constructor() { log.push('open'); } close() { log.push('close'); } }
    function Feed() { const [socket] = useState(() => new Socket()); useEffect(() => () => socket.close(), [socket]); return null; }
    const { root } = await mount(strict ? <StrictMode><Feed /></StrictMode> : <Feed />);
    const atMount = log.join(',');
    await act(async () => root.unmount());
    console.log('P6 strict=' + strict, 'mount:', atMount, '| after unmount:', log.join(','));
  }
});
