import { Suspense, use } from 'react';
import { render, act } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
vi.useFakeTimers();
const cache = new Map<string, Promise<string>>(); const started: Record<string, number> = {}; let now = 0;
function load(k: string) { if (!cache.has(k)) { started[k] = now; cache.set(k, new Promise(r => setTimeout(() => r(k), 100))); } return cache.get(k)!; }
function Leaf({ k }: { k: string }) { return <i>{use(load(k))}</i>; }
function Wrap({ k }: { k: string }) { return <Leaf k={k} />; }
test('siblings', async () => {
  render(<Suspense fallback="fb"><Leaf k="a" /><Leaf k="b" /></Suspense>);
  await act(async () => {});
  console.log('siblings same boundary started at', JSON.stringify(started));
});
test('nested child after suspend', async () => {
  cache.clear(); for (const k in started) delete started[k];
  function Parent() { const a = use(load('pa')); return <Leaf k="child" />; }
  render(<Suspense fallback="fb"><Parent /></Suspense>);
  await act(async () => { vi.advanceTimersByTime(150); });
  await act(async () => { vi.advanceTimersByTime(150); });
  console.log('parent->child (real waterfall) started', JSON.stringify(started));
});
