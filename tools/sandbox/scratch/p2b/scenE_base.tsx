import React from 'react';
export const LOG: string[] = [];
import {
  Suspense, use, useEffect, useLayoutEffect, useState, useTransition,
} from 'react';
import { createRoot } from 'react-dom/client';

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

createRoot(document.getElementById('root')!).render(<App />);
