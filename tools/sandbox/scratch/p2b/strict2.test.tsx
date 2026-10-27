import React, { StrictMode, useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=50) => new Promise(r => setTimeout(r, ms));
test('probe', async () => {
  const log: string[] = []; const console_ = { log: (s: string) => log.push(s) };
  function Probe({ label }: { label: string }) {
    console_.log(`${label} render`);
    const [n, setN] = useState(() => { console_.log(`${label} init`); return 0; });
    useLayoutEffect(() => { console_.log(`${label} layout setup`); return () => console_.log(`${label} layout cleanup`); }, []);
    useEffect(() => { console_.log(`${label} effect setup`); return () => console_.log(`${label} effect cleanup`); }, []);
    return <button onClick={() => setN((x) => { console_.log(`${label} updater`); return x + 1; })}>{n}</button>;
  }
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
  root.render(<StrictMode><Probe label="P" /></StrictMode>); await tick();
  console.log('MOUNT', log.slice()); log.length = 0;
  c.querySelector('button')!.click(); await tick(); console.log('CLICK', log.slice()); log.length = 0;
  root.unmount(); await tick(); console.log('UNMOUNT', log.slice());
});
