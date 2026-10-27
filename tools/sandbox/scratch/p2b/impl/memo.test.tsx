// memo.test.tsx
import { Profiler, memo, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';   // needed for toHaveTextContent (or assert on .textContent)
import { createRecorder } from './recorder';

test('memo child is skipped when parent state changes', async () => {
  const childBody = vi.fn();
  const rec = createRecorder();

  const Child = memo(function Child({ label }: { label: string }) {
    childBody(label);
    return <span>{label}</span>;
  });

  // The Profiler itself must sit behind a memo boundary. If <Profiler> is rendered directly by the
  // re-rendering Parent, React re-renders the Profiler fiber and calls onRender on every update
  // (with actualDuration ~ 0) even though Child bails out.
  const ProfiledChild = memo(function ProfiledChild() {
    return (
      <Profiler id="child" onRender={rec.onRender}>
        <Child label="static" />
      </Profiler>
    );
  });

  function Parent() {
    const [n, setN] = useState(0);
    return (
      <>
        <button onClick={() => setN(n + 1)}>{n}</button>
        <ProfiledChild />
      </>
    );
  }

  render(<Parent />);
  expect(childBody).toHaveBeenCalledTimes(1);
  expect(rec.commits.map((c) => c.phase)).toEqual(['mount']);
  rec.reset();

  await userEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('1');
  expect(childBody).toHaveBeenCalledTimes(1);   // (a) spy: body not invoked
  expect(rec.commits).toHaveLength(0);          // (b) Profiler: no commit inside the profiled subtree
});
