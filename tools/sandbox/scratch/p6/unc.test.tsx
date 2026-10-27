import { Suspense, use } from 'react';
import { render, act } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('uncached promise in render', async () => {
  const errs: string[] = []; vi.spyOn(console, 'error').mockImplementation((...a) => { errs.push(String(a[0]).slice(0, 200)); });
  let renders = 0; let c!: HTMLElement;
  function P() { renders++; if (renders > 50) throw new Error('loop >50'); const v = use(new Promise<string>((r) => setTimeout(() => r('v'), 20))); return <p>{v}</p>; }
  await act(async () => { c = render(<Suspense fallback="fb"><P /></Suspense>).container; });
  for (let i = 0; i < 8; i++) { await new Promise((r) => setTimeout(r, 40)); await act(async () => {}); }
  console.log('RESULT content:', JSON.stringify(c.textContent), '| P renders', renders, '| console.error:', errs.slice(0, 2));
});
