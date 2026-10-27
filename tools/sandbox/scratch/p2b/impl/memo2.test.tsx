import { Profiler, memo, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { createRecorder } from './recorder';
test('variant A: Profiler directly in Parent', async () => {
  const rec = createRecorder(); const childBody = vi.fn();
  const Child = memo(function Child({ label }: { label: string }) { childBody(label); return <span>{label}</span>; });
  function Parent() { const [n, setN] = useState(0); return <><button onClick={() => setN(n + 1)}>{n}</button><Profiler id="child" onRender={rec.onRender}><Child label="static" /></Profiler></>; }
  render(<Parent />); rec.reset(); await userEvent.click(screen.getByRole('button'));
  console.log('A commits', JSON.stringify(rec.commits.map(c => [c.phase, +c.actualDuration.toFixed(2)])), 'childBody', childBody.mock.calls.length);
});
test('variant B: Profiler inside a memo wrapper', async () => {
  const rec = createRecorder(); const childBody = vi.fn();
  const Child = memo(function Child({ label }: { label: string }) { childBody(label); return <span>{label}</span>; });
  const Profiled = memo(function Profiled() { return <Profiler id="child" onRender={rec.onRender}><Child label="static" /></Profiler>; });
  function Parent() { const [n, setN] = useState(0); return <><button onClick={() => setN(n + 1)}>{n}</button><Profiled /></>; }
  render(<Parent />); const mount = rec.commits.map(c => c.phase); rec.reset(); await userEvent.click(screen.getByRole('button'));
  console.log('B mount', mount, 'update commits', rec.commits.length, 'childBody', childBody.mock.calls.length);
  expect(rec.commits).toHaveLength(0);
});
test('variant C: child unmemoized, Profiler directly in Parent (control)', async () => {
  const rec = createRecorder();
  function Child({ label }: { label: string }) { return <span>{label}</span>; }
  function Parent() { const [n, setN] = useState(0); return <><button onClick={() => setN(n + 1)}>{n}</button><Profiler id="child" onRender={rec.onRender}><Child label="static" /></Profiler></>; }
  render(<Parent />); rec.reset(); await userEvent.click(screen.getByRole('button'));
  console.log('C commits', JSON.stringify(rec.commits.map(c => [c.phase, +c.actualDuration.toFixed(3)])));
});
