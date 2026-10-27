import React, { useState, useTransition, Suspense, use, useMemo, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms = 60) => new Promise(r => setTimeout(r, ms));
const set = (input: HTMLInputElement, v: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true })); };
test('D1', async () => {
  const items = Array.from({ length: 200 }, (_, i) => 'item' + i);
  function HeavyRow({ text }: any) { const t = performance.now(); while (performance.now() - t < 1); return <li>{text}</li>; }
  function SearchPage() { const [text, setText] = useState(''); const [isPending, st] = useTransition(); const visible = items.filter(s => s.includes(text));
    return <><input value={text} onChange={(e) => { const v = e.target.value; st(() => setText(v)); }} />{isPending && <span>…</span>}<ul>{visible.map(s => <HeavyRow key={s} text={s} />)}</ul></>; }
  const c = document.createElement('div'); document.body.appendChild(c); createRoot(c).render(<SearchPage />); await tick(300);
  const input = c.querySelector('input')!; set(input, 'i'); const immediate = input.value; await tick(10); const t10 = input.value; await tick(600);
  console.log('D1 value right after event:', JSON.stringify(immediate), '10ms later:', JSON.stringify(t10), 'final:', JSON.stringify(input.value));
});
test('D2', async () => {
  let fetches = 0; (globalThis as any).fetch = () => { fetches++; return new Promise(r => setTimeout(() => r({ json: () => Promise.resolve({ name: 'Ada' }) }), 50)); };
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 90));
  function UserCard({ id }: any) { const user = use(fetch(`/api/users/${id}`).then((r: any) => r.json())) as any; return <h2>{user.name}</h2>; }
  function UserCard2({ id }: any) { const p = useMemo(() => fetch(`/api/users/${id}`).then((r: any) => r.json()), [id]); const user = use(p) as any; return <h2>{user.name}</h2>; }
  for (const [name, C] of [['plain', UserCard], ['useMemo', UserCard2]] as any) {
    fetches = 0; const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); root.render(<Suspense fallback={<p>Loading…</p>}><C id="1" /></Suspense>); await tick(1500);
    console.log('D2', name, 'fetches after 1.5s:', fetches, 'html:', c.innerHTML); root.unmount();
  }
  console.error = o; console.log('D2 console.error', errs);
}, 10000);
test('D4', async () => {
  let renderCount = 0;
  function Leaderboard({ scores }: any) { renderCount++; const sorted = scores.sort((a: number, b: number) => b - a); return <ol>{sorted.map((s: number, i: number) => <li key={i}>{s}</li>)}<li>renders: {renderCount}</li></ol>; }
  function Summary({ scores }: any) { return <p>First entered: {scores[0]}</p>; }
  function Game({ swap }: any) { const [scores, setScores] = useState([10, 30, 20]); return <><button onClick={() => setScores([...scores, 25])}>Add</button>{swap ? <><Summary scores={scores} /><Leaderboard scores={scores} /></> : <><Leaderboard scores={scores} /><Summary scores={scores} /></>}</>; }
  for (const strict of [false, true]) for (const swap of [false, true]) {
    renderCount = 0; document.body.innerHTML = ''; const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
    root.render(strict ? <StrictMode><Game swap={swap} /></StrictMode> : <Game swap={swap} />); await tick(80);
    const before = c.querySelector('p')!.textContent; c.querySelector('button')!.click(); await tick(80);
    console.log('D4 strict', strict, 'swap', swap, '| summary:', before, '->', c.querySelector('p')!.textContent, '| renders text:', c.querySelector('li:last-child')?.textContent);
  }
});
