// profile.test.tsx (Vitest, @testing-library/react ≥ 16, React 19)
import { Suspense, use } from 'react';
import { act, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';

interface User { name: string }

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

function Profile({ promise }: { promise: Promise<User> }) {
  const user = use(promise);
  return <h1>{user.name}</h1>;
}

test('shows fallback, then content, without ever showing content early', async () => {
  const d = deferred<User>();
  await act(async () => {
    render(
      <Suspense fallback={<p>loading</p>}>
        <Profile promise={d.promise} />
      </Suspense>,
    );
  });
  expect(screen.getByText('loading')).toBeInTheDocument();
  expect(screen.queryByRole('heading')).toBeNull();

  await act(async () => { d.resolve({ name: 'Ada' }); });
  expect(screen.getByRole('heading')).toHaveTextContent('Ada');
  expect(screen.queryByText('loading')).toBeNull();
});
