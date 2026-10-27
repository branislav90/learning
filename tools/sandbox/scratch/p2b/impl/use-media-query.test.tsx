// use-media-query.test.tsx
// @vitest-environment jsdom
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useMediaQuery } from './use-media-query';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Layout() {
  const wide = useMediaQuery('(min-width: 600px)', false);
  return <p>{wide ? 'wide' : 'narrow'}</p>;
}

beforeEach(() => {
  window.matchMedia = ((q: string) => ({
    matches: true, media: q,
    addEventListener: () => {}, removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});
afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); });

test('hydrates with server value then converges without errors', async () => {
  const html = renderToString(<Layout />);
  expect(html).toContain('narrow');                       // server value

  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);

  const errors: unknown[] = [];
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => {
    hydrateRoot(container, <Layout />, { onRecoverableError: (e) => errors.push(e) });
  });

  expect(errors).toHaveLength(0);
  expect(container.textContent).toBe('wide');             // client snapshot applied after hydration
});
