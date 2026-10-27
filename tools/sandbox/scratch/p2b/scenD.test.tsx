import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { test } from 'vitest';
export const LOG: string[] = [];
import {
  memo, Profiler, useState, useTransition,
  type ChangeEvent, type ProfilerOnRenderCallback,
} from 'react';

const t0 = performance.now();
const log = (msg: string): void =>
  LOG.push(msg);

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

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
function type(input: HTMLInputElement, v: string) { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true })); }
const tick = (ms: number) => new Promise(r => setTimeout(r, ms));
test('one keystroke', async () => {
  const r = render(<SearchDemo />); await tick(100); LOG.length = 0;
  const input = r.container.querySelector('input')!;
  type(input, 'i'); LOG.push('-- after change() returns');
  await tick(1200); console.log('ONE KEY', LOG.map(l => l.replace(/\s+/g, ' ')));
  r.unmount();
});
test('two keystrokes', async () => {
  const r = render(<SearchDemo />); await tick(100); LOG.length = 0;
  const input = r.container.querySelector('input')!;
  type(input, 'i');
  setTimeout(() => { LOG.push('-- second key'); type(input, 'it'); }, 150);
  await tick(2000); console.log('TWO KEYS', LOG.map(l => l.replace(/\s+/g, ' ')));
  r.unmount();
});
