import { createContext, useContext, useState, useMemo, memo, useSyncExternalStore, useTransition, startTransition } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const Ctx = createContext(0);
test('B1/B2', async () => {
  const log: string[] = [];
  function Child() { log.push('child'); return <p>static</p>; }
  function Provider({ children }: any) { const [n, setN] = useState(0); return <Ctx value={n}><button onClick={() => setN(n + 1)}>+</button>{children}</Ctx>; }
  render(<Provider><Child /></Provider>); const at = log.length; await act(async()=>{fireEvent.click(screen.getByText('+'))});
  console.log('B1 child renders: mount', at, 'after click', log.length - at);
  log.length = 0;
  function Provider2() { const [n, setN] = useState(0); return <Ctx value={n}><button onClick={() => setN(n + 1)}>+</button><Child /></Ctx>; }
  render(<Provider2 />); const at2 = log.length; await act(async()=>{fireEvent.click(screen.getAllByText('+')[1])});
  console.log('B2 child renders: mount', at2, 'after click', log.length - at2);
});
test('memo consumer + split', async () => {
  const log: string[] = []; const C2 = createContext({ a: 0, b: 0 });
  const A = memo(function A() { const { a } = useContext(C2); log.push('A'); return <i>{a}</i>; });
  const B = memo(function B() { const { b } = useContext(C2); log.push('B'); return <i>{b}</i>; });
  function P({ children }: any) { const [s, set] = useState({ a: 0, b: 0 }); const v = useMemo(() => s, [s]); return <C2 value={v}><button onClick={() => set({ ...s, b: s.b + 1 })}>b++</button>{children}</C2>; }
  render(<P><A /><B /></P>); log.length = 0; await act(async()=>{fireEvent.click(screen.getByText('b++'))});
  console.log('memo consumers after b change (A only reads a):', log.join(','));
});
test('store in transition is still sync', async () => {
  let val = 'old'; const subs = new Set<() => void>(); const store = { get: () => val, sub: (f: () => void) => { subs.add(f); return () => subs.delete(f); }, set: (v: string) => { val = v; subs.forEach(f => f()); } };
  const log: string[] = []; let start!: (f: () => void) => void;
  function C() { const v = useSyncExternalStore(store.sub, store.get); const [p, st] = useTransition(); start = st; const [rs, setRs] = useState('old'); log.push(`pending=${p} store=${v} reactState=${rs}`); (C as any).setRs = setRs; return <p>{v}</p>; }
  render(<C />); log.length = 0;
  await act(async () => { start(() => { store.set('new'); (C as any).setRs('new'); }); });
  console.log(log.join('\n'));
});
