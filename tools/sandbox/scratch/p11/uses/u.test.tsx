// @vitest-environment jsdom
import React, { useSyncExternalStore, useRef, StrictMode } from 'react';
import { render, act } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
function createStore<T>(initial: T) {
  let state = initial; const listeners = new Set<() => void>();
  return { getState: () => state, setState(next: (s: T) => T) { state = next(state); listeners.forEach(l => l()); },
    subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; } };
}
type S = { a: number; b: number };
function setup() {
  const store = createStore<S>({ a: 0, b: 0 });
  const useSelector = <R,>(sel: (s: S) => R) => useSyncExternalStore(store.subscribe, () => sel(store.getState()));
  return { store, useSelector };
}
it('primitive', () => {
  const { store, useSelector } = setup(); let renders = 0;
  function P() { const a = useSelector(s => s.a); renders++; return <p>{a}</p>; }
  render(<P />); const before = renders;
  act(() => store.setState(s => ({ ...s, b: s.b + 1 })));
  console.log('primitive renders', before, '->', renders);
  const r2 = { n: 0 };
  function Q() { const a = useSelector(s => s.a); const ref = useRef(0); ref.current++; r2.n = ref.current; return <p>{a}</p>; }
  render(<StrictMode><Q /></StrictMode>); console.log('strict ref count after mount', r2.n);
});
it('object', () => {
  const { useSelector } = setup(); const err = vi.spyOn(console, 'error').mockImplementation(() => {});
  function O() { const p = useSelector(s => ({ a: s.a })); return <p>{p.a}</p>; }
  let thrown: any = null;
  try { render(<O />); } catch (e) { thrown = e; }
  console.log('thrown:', thrown && String(thrown.message).slice(0, 120));
  console.log('console.error:', err.mock.calls.map(c => String(c[0]).slice(0, 140)).slice(0, 2).join(' | '));
});
