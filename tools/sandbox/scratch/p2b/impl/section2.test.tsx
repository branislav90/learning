import React from 'react';
import { createRoot } from 'react-dom/client';
import { expect, test, vi } from 'vitest';
import { Section } from './Section';
test('section raw root', async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
  let calls = 0;
  vi.stubGlobal('fetch', vi.fn(async () => { calls++; if (calls === 1) return { ok: false, status: 500 }; return { ok: true, json: async () => ({ name: 'Ada' }) }; }));
  const errs: any[] = []; vi.spyOn(console, 'error').mockImplementation((...a) => errs.push(String(a[0]).slice(0, 80)));
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c, { onCaughtError: (e: any) => errs.push('caught ' + e.message) });
  root.render(<Section id="1" />);
  await new Promise(r => setTimeout(r, 800)); console.log('I3 after 800ms:', c.innerHTML, 'calls', calls, errs);
  (c.querySelector('button') as HTMLElement)?.click();
  await new Promise(r => setTimeout(r, 800)); console.log('I3 after retry:', c.innerHTML, 'calls', calls);
});
