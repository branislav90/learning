import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { Section } from './Section';
test('section under RTL', async () => {
  let calls = 0;
  vi.stubGlobal('fetch', vi.fn(async () => { calls++; return { ok: true, json: async () => ({ name: 'Ada' }) }; }));
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 160));
  await act(async () => { render(<Section id="9" />); });
  console.error = o; console.log('errs', errs);
  console.log('after render', document.body.innerHTML, 'calls', calls);
  await act(async () => { await new Promise(r => setTimeout(r, 50)); });
  console.log('after act wait', document.body.innerHTML);
  await waitFor(() => expect(screen.getByRole('heading').textContent).toBe('Ada'), { timeout: 2000 });
});
