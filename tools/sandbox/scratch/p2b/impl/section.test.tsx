import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Section } from './Section';
test('section loads, fails, retries', async () => {
  let calls = 0;
  vi.stubGlobal('fetch', vi.fn(async () => { calls++; if (calls === 1) return { ok: false, status: 500 }; return { ok: true, json: async () => ({ name: 'Ada' }) }; }));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<Section id="1" />);
  expect(screen.getByText('Loading…')).toBeTruthy();
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('HTTP 500'), { timeout: 3000 });
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  await waitFor(() => expect(screen.getByRole('heading').textContent).toBe('Ada'), { timeout: 3000 });
  console.log('I3 fetch calls', calls);
});
