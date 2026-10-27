import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const L = ({ k }: { k: string[] }) => <ul>{k.map(x => <li key={x}>{x}</li>)}</ul>;
test('real moves', async () => {
  const cases: [string, string[], string[]][] = [
    ['reverse', ['A','B','C','D'], ['D','C','B','A']], ['first to end', ['A','B','C','D'], ['B','C','D','A']], ['last to front', ['A','B','C','D'], ['D','A','B','C']],
    ['swap B,D', ['A','B','C','D'], ['A','D','C','B']], ['insert head', ['A','B','C'], ['N','A','B','C']], ['delete B', ['A','B','C','D'], ['A','C','D']], ['swap adjacent', ['A','B','C','D'], ['A','C','B','D']],
    ['5: last to front', ['A','B','C','D','E'], ['E','A','B','C','D']]];
  for (const [name, o, n] of cases) {
    const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); await act(async () => root.render(<L k={o} />));
    let buf: MutationRecord[] = []; const mo = new MutationObserver(l => buf.push(...l)); mo.observe(c, { subtree: true, childList: true });
    await act(async () => root.render(<L k={n} />)); buf.push(...mo.takeRecords());
    const removed = buf.flatMap(r => [...r.removedNodes].map(x => x.textContent)); const added = buf.flatMap(r => [...r.addedNodes].map(x => x.textContent));
    console.log(name.padEnd(16), 'removed', removed.join(''), 'added', added.join(''), 'order', c.textContent);
  }
});
