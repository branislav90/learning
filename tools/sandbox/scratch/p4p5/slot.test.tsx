// @vitest-environment jsdom
import { test } from 'vitest';
import React, { act, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Slot } from './slot.src';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('slot', async () => {
  const log: string[] = []; const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 100));
  let sr: any, cr: any;
  function App() { sr = useRef<HTMLElement>(null); cr = useRef<HTMLAnchorElement>(null);
    return <Slot ref={sr} className="btn" onClick={() => log.push('slot')} style={{ color: 'red' }}><a href="#x" className="link" onClick={() => log.push('child')} ref={cr}>Go</a></Slot>; }
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(<App />));
  await act(async () => { host.querySelector('a')!.click(); });
  console.error = o;
  console.log('SLOT', log, host.innerHTML, 'refs', sr.current?.tagName, cr.current?.tagName, errs);
  await act(async () => root.unmount()); console.log('SLOT after unmount refs', sr.current, cr.current);
});
