// @vitest-environment jsdom
import { test, expect, afterEach } from 'vitest';
import React, { StrictMode, createContext, memo, useContext, useReducer, useState, useRef } from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
afterEach(cleanup);

test('reducer B1', () => {
  let renders = 0;
  function C() {
    renders++;
    const [s, dispatch] = useReducer((s: { n: number }, a: 'inc') => ({ n: s.n + 1 }), { n: 0 });
    return <button onClick={() => { dispatch('inc'); dispatch('inc'); dispatch('inc'); }}>{s.n}</button>;
  }
  render(<C />); const before = renders; fireEvent.click(screen.getByRole('button'));
  console.log('B1 text', screen.getByRole('button').textContent, 'renders after click', renders - before);
});
test('reducer strict double call', () => {
  let calls = 0; const args: any[] = [];
  function C() {
    const [s, dispatch] = useReducer((s: { n: number }, a: 'inc') => { calls++; args.push(s); return { n: s.n + 1 }; }, { n: 0 });
    return <button onClick={() => dispatch('inc')}>{s.n}</button>;
  }
  render(<StrictMode><C /></StrictMode>); calls = 0; fireEvent.click(screen.getByRole('button'));
  console.log('strict reducer calls per dispatch', calls, screen.getByRole('button').textContent);
});
test('provider B1', () => {
  let inner = 0;
  const Ctx = createContext(0);
  function Provider() { const [n, setN] = useState(0); return <Ctx value={n}><button onClick={() => setN(x => x + 1)}>+</button><Outer /></Ctx>; }
  const Outer = memo(function Outer() { return <Inner />; });
  function Inner() { useContext(Ctx); inner++; return null; }
  render(<Provider />); const b = inner; fireEvent.click(screen.getByRole('button'));
  console.log('Provider B1 inner renders after click', inner - b);
});
test('provider B4 sidebar', () => {
  let side = 0, setT: any;
  const T = createContext('l');
  function ThemeProvider({ children }: { children: React.ReactNode }) { const [t, set] = useState('l'); setT = set; return <T value={t}>{children}</T>; }
  function Sidebar() { side++; return <i />; }
  function App() { return <ThemeProvider><Sidebar /></ThemeProvider>; }
  render(<App />); const b = side; act(() => setT('d'));
  console.log('Sidebar rerenders', side - b);
});
test('controlled B2', () => {
  const log: number[] = [];
  function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) { return <><span data-testid="v">{value}</span><button onClick={() => onChange(value + 1)}>+</button></>; }
  render(<Stepper value={3} onChange={(n) => log.push(n)} />);
  fireEvent.click(screen.getByRole('button')); fireEvent.click(screen.getByRole('button'));
  console.log('controlled', log, screen.getByTestId('v').textContent);
});
