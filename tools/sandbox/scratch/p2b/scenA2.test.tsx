import React, { useState, memo, ReactNode } from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const pk = (n: any) => Object.keys(n).find(k => k.startsWith('__reactProps$'))!;
function Child({ title }: { title: string }) { return <article className="card" style={{ padding: 8 }} data-testid="child"><h3>{title}</h3><p>x</p></article>; }
const CM = memo(Child);
function P({ M }: any) { const [n, setN] = useState(0); const C = M ? CM : Child; return <section><button onClick={() => setN(x => x + 1)}>c{n}</button><C title="Static" /></section>; }
for (const M of [false, true]) test('props refresh ' + M, async () => {
  const r = render(<P M={M} />); const art = r.container.querySelector('article')!, h3 = r.container.querySelector('h3')!;
  const a0 = (art as any)[pk(art)], h0 = (h3 as any)[pk(h3)];
  await userEvent.click(r.container.querySelector('button')!);
  console.log(M ? 'memo child' : 'plain child', 'article props object replaced:', (art as any)[pk(art)] !== a0, '| h3 props replaced:', (h3 as any)[pk(h3)] !== h0);
});
