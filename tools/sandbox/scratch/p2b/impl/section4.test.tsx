import React, { Suspense, use } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { test } from 'vitest';
const tick = (ms: number) => new Promise(r => setTimeout(r, ms));
test('act env true, raw root', async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const p = new Promise<string>(r => setTimeout(() => r('Ada'), 20));
  function U() { return <h2>{use(p)}</h2>; }
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
  await act(async () => { root.render(<Suspense fallback={<p>Loading…</p>}><U /></Suspense>); });
  console.log('A1 after act render:', c.innerHTML);
  await tick(500); console.log('A2 after 500ms real wait (outside act):', c.innerHTML);
  await act(async () => { await tick(10); }); console.log('A3 after act wait:', c.innerHTML);
  await tick(1500); console.log('A4 later:', c.innerHTML);
});
