import React, { act, useState, useSyncExternalStore, type ReactElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); });
function Stamp({ value }: { value: string }) { return <p>{value}</p>; }
function Env() { const v = useSyncExternalStore(() => () => {}, () => 'client', () => 'server'); return <p>{v}</p>; }
async function hydrateWith(serverEl: ReactElement, clientEl: ReactElement) {
  const container = document.createElement('div'); container.innerHTML = renderToString(serverEl); document.body.append(container);
  const errors: unknown[] = []; const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => { hydrateRoot(container, clientEl, { onRecoverableError: (e) => errors.push(e) }); });
  return { container, errors, spy };
}
test('text mismatch', async () => { const { container, errors } = await hydrateWith(<Stamp value="server" />, <Stamp value="client" />); expect(errors.length).toBeGreaterThan(0); expect(container.textContent).toBe('client'); });
test('gss', async () => { const { container, errors } = await hydrateWith(<Env />, <Env />); expect(errors).toHaveLength(0); expect(container.textContent).toBe('client'); });
test('C3 invalid nesting', async () => {
  const bad = () => <p><div>Hi</div></p>;
  const container = document.createElement('div'); container.innerHTML = renderToString(bad()); document.body.append(container);
  console.log('PARSED DOM', container.innerHTML);
  const errors: unknown[] = []; const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => { hydrateRoot(container, bad(), { onRecoverableError: (e) => errors.push(e) }); });
  console.log('C3 errors', errors.length, 'console.error calls', spy.mock.calls.length, String(spy.mock.calls[0]?.[0]).slice(0,100)); expect(errors.length).toBeGreaterThan(0);
});
test('render counts for mismatch, and attr persistence', async () => {
  let n = 0; const log: string[] = [];
  function Clock({ v }: any) { log.push('Clock render'); return <p id="stamp">{v}</p>; }
  const container = document.createElement('div'); container.innerHTML = renderToString(<main><h1>x</h1><Clock v="a" /></main>); document.body.append(container); log.length = 0;
  const errors: any[] = []; const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => { hydrateRoot(container, <main><h1>x</h1><Clock v="b" /></main>, { onRecoverableError: (e) => errors.push(e) }); });
  console.log('CLOCK client renders', log.length, 'errors', errors.length, 'console.error', spy.mock.calls.length);
  // attr persistence
  const c2 = document.createElement('div'); document.body.append(c2);
  const T = ({ theme }: any) => <div className={theme}>t</div>;
  c2.innerHTML = renderToString(<T theme="light" />); let root: any;
  await act(async () => { root = hydrateRoot(c2, <T theme="dark" />); });
  console.log('ATTR after hydrate:', c2.innerHTML);
  await act(async () => { root.render(<T theme="dark" />); }); console.log('ATTR after re-render same prop:', c2.innerHTML);
  await act(async () => { root.render(<T theme="blue" />); }); console.log('ATTR after prop change:', c2.innerHTML);
});
