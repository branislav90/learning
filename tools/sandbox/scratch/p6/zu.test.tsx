import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { persist, createJSONStorage, devtools, subscribeWithSelector } from 'zustand/middleware';
import { render, screen, act } from '@testing-library/react';
import * as T from 'zustand/traditional';
import * as Z from 'zustand';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('exports', () => { console.log('zustand exports', Object.keys(Z).join(','), '| traditional', Object.keys(T).join(',')); });
test('new object selector v5', () => {
  const useS = create(() => ({ a: 1, b: 2 }));
  const errs: string[] = []; const sp = vi.spyOn(console, 'error').mockImplementation((...a) => { errs.push(String(a[0]).slice(0, 120)); });
  function C() { const { a } = useS((s) => ({ a: s.a })); return <p>{a}</p>; }
  let threw = ''; try { render(<C />); } catch (e: any) { threw = e.message.slice(0, 100); }
  console.log('new-object selector: threw=', threw, '| console.error:', errs.slice(0, 2)); sp.mockRestore();
});
test('useShallow', async () => {
  const useS = create(() => ({ a: 1, b: 2, c: 3 })); let renders = 0;
  function C() { renders++; const { a, b } = useS(useShallow((s) => ({ a: s.a, b: s.b }))); return <p>{a}{b}</p>; }
  render(<C />); const r0 = renders; await act(async () => { useS.setState({ c: 9 }); }); const r1 = renders; await act(async () => { useS.setState({ a: 5 }); });
  console.log('useShallow renders: initial', r0, 'after unrelated c change', r1, 'after a change', renders);
});
test('set replace and merge, listeners args', () => {
  const useS = create<{ n: number; m?: number }>()((set) => ({ n: 0 })); const calls: any[] = []; useS.subscribe((s, p) => calls.push([s, p]));
  useS.setState({ m: 1 }); useS.setState({ m: 1 }); useS.setState(s => s); useS.setState({ n: 1 }, true as any);
  console.log('listener calls', JSON.stringify(calls), 'state', JSON.stringify(useS.getState()), 'getInitialState', JSON.stringify(useS.getInitialState()));
});
test('persist', async () => {
  const store: Record<string, string> = {}; const storage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; }, removeItem: (k: string) => { delete store[k]; } };
  store['k'] = JSON.stringify({ state: { n: 5, secret: 's' }, version: 0 });
  const useS = create<any>()(persist((set) => ({ n: 0, secret: '', inc: () => set((s: any) => ({ n: s.n + 1 })) }), { name: 'k', version: 1, storage: createJSONStorage(() => storage), partialize: (s: any) => ({ n: s.n }), migrate: (p: any, v: number) => { console.log('migrate from', v, JSON.stringify(p)); return { ...p, n: p.n * 10 }; } }));
  console.log('sync storage hydrates synchronously during create? n=', useS.getState().n, 'hasHydrated', useS.persist.hasHydrated());
  useS.getState().inc(); console.log('stored', store['k']);
});
test('subscribeWithSelector', () => {
  const useS = create<{ a: number; b: number }>()(subscribeWithSelector(() => ({ a: 0, b: 0 }))); const seen: any[] = [];
  useS.subscribe((s) => s.a, (a, p) => seen.push([a, p])); useS.setState({ b: 1 }); useS.setState({ a: 1 }); console.log('subscribeWithSelector', JSON.stringify(seen));
});
