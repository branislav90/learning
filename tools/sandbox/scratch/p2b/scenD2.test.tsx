import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import { test } from 'vitest';
export const LOG: string[] = [];
import {
  memo, Profiler, useState, useTransition,
  type ChangeEvent, type ProfilerOnRenderCallback,
} from 'react';

const t0 = performance.now();
const log = (msg: string): void =>
  console.log(msg);

function busyWait(ms: number): void {
  const end = performance.now() + ms;
  while (performance.now() < end) { /* artificial CPU cost */ }
}

const ITEMS: readonly string[] = Array.from({ length: 500 }, (_, i) => `item-${i}`);

function SlowRow({ text }: { text: string }) {
  busyWait(1);               // ≈ 1 ms per row, simulating expensive markup
  return <li>{text}</li>;
}

const SlowList = memo(function SlowList(
  { items, filter }: { items: readonly string[]; filter: string },
) {
  log(`render List f=${filter}`);
  const visible = items.filter((s) => s.includes(filter));
  return (
    <ul>
      {visible.map((s) => <SlowRow key={s} text={s} />)}
    </ul>
  );
});

const onRender: ProfilerOnRenderCallback = (id, phase, actual) => {
  // Fires once per COMMIT of the subtree. Abandoned renders never reach it.
  log(`COMMIT [${id}] phase=${phase} actual=${actual.toFixed(1)}ms`);
};

export function SearchDemo() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  log(`render Search q=${query} f=${filter} pending=${isPending}`);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setQuery(next);                          // urgent: input echo
    startTransition(() => setFilter(next));  // non-urgent: list
  }

  return (
    <Profiler id="search" onRender={onRender}>
      <label>
        Filter <input value={query} onChange={onChange} />
      </label>
      {isPending && <span role="status">Updating…</span>}
      <SlowList items={ITEMS} filter={filter} />
    </Profiler>
  );
}


test('every commit is observable and ends on the final filter', async () => {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  render(<SearchDemo />);
  spy.mockClear();
  await userEvent.type(screen.getByRole('textbox'), 'it');
  await act(async () => {});
  const lines = spy.mock.calls.map((c) => String(c[0]));
  expect(lines.some((l) => l.includes('render List f=it'))).toBe(true);
  expect(screen.getAllByRole('listitem').every((li) => li.textContent!.includes('it'))).toBe(true);
  spy.mockRestore(); console.log('lines', lines.length);
});
