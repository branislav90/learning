import { Suspense, use } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { it, expect } from 'vitest';
import { fulfilled } from '../src/app/data/cache';

function Show({ p }: { p: Promise<string> }) { return <p>{use(p)}</p>; }
function render(p: Promise<string>) {
  const el = document.createElement('div'); document.body.append(el);
  const root = createRoot(el);
  flushSync(() => root.render(<Suspense fallback={<i>fallback</i>}><Show p={p} /></Suspense>));
  const html = el.innerHTML; root.unmount(); return html;
}
it('use() on pre-marked promise renders synchronously; unmarked suspends once', () => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
  const marked = render(fulfilled('DATA'));
  const plain = render(Promise.resolve('DATA'));
  console.log('marked ->', marked, '| plain ->', plain);
  expect(marked).toBe('<p>DATA</p>');
});
