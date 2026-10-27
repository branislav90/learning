// @vitest-environment jsdom
import React, { useEffect, useState, memo } from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, it, expect, beforeEach, afterEach, describe } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(cleanup);
if (process.env.SHIM) (globalThis as any).jest = { advanceTimersByTime: vi.advanceTimersByTime };
import '@testing-library/jest-dom/vitest';
function SearchBox({ search, debounceMs }: { search: (q: string) => Promise<string[]>; debounceMs: number }) {
  const [q, setQ] = useState(''); const [res, setRes] = useState<string[]>([]);
  useEffect(() => { if (!q) return; let stale = false; const t = setTimeout(() => { search(q).then(r => { if (!stale) setRes(r); }); }, debounceMs); return () => { stale = true; clearTimeout(t); }; }, [q, search, debounceMs]);
  return <div><input role="searchbox" aria-label="search" value={q} onChange={e => setQ(e.target.value)} /><ul>{res.map(r => <li key={r}>{r}</li>)}</ul></div>;
}
describe('fake timers', () => {
  beforeEach(() => { vi.useFakeTimers(); }); afterEach(() => { vi.useRealTimers(); });
  it('searches 300 ms after the last keystroke', async () => {
    const search = vi.fn().mockResolvedValue([]);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBox search={search} debounceMs={300} />);
    await user.type(screen.getByRole('searchbox', { name: /search/i }), 'rea');
    expect(search).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(299); expect(search).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(search).toHaveBeenCalledExactlyOnceWith('rea');
  });
});
it('ignores a slow earlier response', async () => {
  let resolveFirst!: (v: string[]) => void;
  const search = vi.fn().mockImplementationOnce(() => new Promise<string[]>((r) => { resolveFirst = r; })).mockImplementationOnce(async () => ['fast-result']);
  render(<SearchBox search={search} debounceMs={0} />);
  const user = userEvent.setup();
  await user.type(screen.getByRole('searchbox'), 'a');
  await user.type(screen.getByRole('searchbox'), 'b');
  expect(await screen.findByText('fast-result')).toBeInTheDocument();
  await act(async () => { resolveFirst(['stale-result']); });
  expect(screen.queryByText('stale-result')).not.toBeInTheDocument();
});
it('second arg of function components', () => {
  const Mock = vi.fn((_p: { x: number }) => null);
  function Parent() { return <Mock x={1} />; }
  render(<Parent />);
  console.log('SECONDARG', JSON.stringify(Mock.mock.calls[0].length), Mock.mock.calls[0][1]);
  expect(Mock).toHaveBeenCalledWith({ x: 1 }, undefined);
});
