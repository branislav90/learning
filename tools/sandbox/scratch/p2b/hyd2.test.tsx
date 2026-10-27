import React, { useState, Suspense, lazy } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms=60) => new Promise(r => setTimeout(r, ms));
test('click immediately after hydrateRoot', async () => {
  const clicks: string[] = [];
  const App = () => <div><button id="b" onClick={() => clicks.push('click')}>x</button></div>;
  const c = document.createElement('div'); document.body.appendChild(c); c.innerHTML = renderToString(<App />);
  hydrateRoot(c, <App />);
  c.querySelector<HTMLElement>('#b')!.click(); clicks.push('--- clicked sync, before any task');
  await tick(100); console.log('SYNC-HYDRATE-ON-CLICK', clicks);
});
test('lazy chunk then click after release', async () => {
  let release!: () => void; const gate = new Promise<void>(r => (release = r)); const clicks: string[] = [];
  const Lazy = lazy(async () => { await gate; return { default: () => <button id="lb" onClick={() => clicks.push('lazy click')}>lazy</button> }; });
  const c = document.createElement('div'); document.body.appendChild(c);
  c.innerHTML = renderToString(<div><Suspense fallback="fb"><button id="lb">lazy</button></Suspense></div>);
  hydrateRoot(c, <div><Suspense fallback="fb"><Lazy /></Suspense></div>); await tick(50);
  c.querySelector<HTMLElement>('#lb')!.click(); clicks.push('clicked-before'); release(); await tick(300);
  c.querySelector<HTMLElement>('#lb')!.click(); await tick(50); console.log('LAZY', clicks);
});
