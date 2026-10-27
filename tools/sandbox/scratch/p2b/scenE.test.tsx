import React from 'react';
export const LOG: string[] = [];
import {
  Suspense, use, useEffect, useLayoutEffect, useState, useTransition,
} from 'react';
import { createRoot } from 'react-dom/client';
import { test } from 'vitest';

interface User { id: string; name: string }

const t0 = performance.now();
const log = (m: string) => { LOG.push(`${(performance.now() - t0).toFixed(0).padStart(5)}ms ${m}`); };

// A tiny promise cache keyed by id (stable identity across renders and retries).
const cache = new Map<string, Promise<User>>();
const NAMES: Record<string, string> = { '1': 'Ada', '2': 'Grace', '3': 'Edsger' };

function getUser(id: string): Promise<User> {
  let p = cache.get(id);
  if (!p) {
    log(`fetch start id=${id}`);
    p = new Promise<User>((resolve) =>
      setTimeout(() => resolve({ id, name: NAMES[id] ?? 'Unknown' }), 800),
    );
    cache.set(id, p);
  }
  return p;
}

function Profile({ id }: { id: string }) {
  log(`Profile start id=${id}`);
  const user = use(getUser(id));            // may suspend
  log(`Profile resolved ${user.name}`);
  useLayoutEffect(() => {
    log(`Profile layout mount ${user.name}`);
    return () => log(`Profile layout cleanup ${user.name}`);
  });
  useEffect(() => { log(`Profile passive effect ${user.name}`); });
  return <h1>{user.name}</h1>;
}

function Sidebar() {
  log('Sidebar render');
  const [count, setCount] = useState(0);
  return <aside><button onClick={() => setCount((c) => c + 1)}>clicks: {count}</button></aside>;
}

function Fallback() {
  log('Fallback render');
  return <p role="status">Loading…</p>;
}

export function App() {
  const [id, setId] = useState('1');
  const [isPending, startTransition] = useTransition();
  log(`App render id=${id} pending=${isPending}`);
  return (
    <>
      <button onClick={() => setId(String(Number(id) % 3 + 1))}>next (urgent)</button>
      <button onClick={() => startTransition(() => setId(String(Number(id) % 3 + 1)))}>
        next (transition)
      </button>
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <Suspense fallback={<Fallback />}>
          <Profile id={id} />
          <Sidebar />
        </Suspense>
      </div>
    </>
  );
}



(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms: number) => new Promise(r => setTimeout(r, ms));
const btn = (c: HTMLElement, t: string) => [...c.querySelectorAll('button')].find(b => b.textContent!.startsWith(t))!;
test('cases a b c', async () => {
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
  LOG.length = 0; root.render(<App />);
  await tick(100); LOG.push('--- t=100: html=' + c.innerHTML.replace(/<button[^>]*>.*?<\/button>/g, '').slice(0, 120));
  await tick(1200); LOG.push('--- after resolve: ' + c.innerHTML.replace(/<button[^>]*>[^<]*<\/button>/g, ''));
  console.log('CASE A\n' + LOG.join('\n')); LOG.length = 0;
  // click sidebar counter then urgent next
  const sb = c.querySelector('aside button') as HTMLElement; sb.click(); await tick(50); sb.click(); await tick(50); LOG.length = 0;
  LOG.push('--- click next (urgent)'); btn(c, 'next (urgent)').click(); await tick(100);
  LOG.push('--- t=100 html: ' + c.innerHTML.slice(0, 400)); await tick(1300); LOG.push('--- after: ' + c.innerHTML.slice(0, 300));
  console.log('CASE B\n' + LOG.join('\n')); LOG.length = 0;
  LOG.push('--- click next (transition)'); btn(c, 'next (transition)').click(); await tick(100);
  LOG.push('--- t=100 html: ' + c.innerHTML.slice(0, 300)); await tick(1300); LOG.push('--- after: ' + c.innerHTML.slice(0, 300));
  console.log('CASE C\n' + LOG.join('\n'));
}, 15000);
