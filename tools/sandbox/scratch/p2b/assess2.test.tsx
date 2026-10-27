import React, { useState, memo, useDeferredValue } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const tick = (ms = 60) => new Promise(r => setTimeout(r, ms));
test('R4c', async () => {
  const LOG: string[] = [];
  const List = memo(function List({ q }: any) { LOG.push('List q=' + q); const t = performance.now(); while (performance.now() - t < 100); return <ul><li>{q}</li></ul>; });
  function Search() { const [q, sq] = useState(''); const d = useDeferredValue(q); LOG.push(`Search q=${q} d=${d}`); return <><input value={q} onChange={(e) => sq(e.target.value)} /><List q={d} /></>; }
  const c = document.createElement('div'); document.body.appendChild(c); createRoot(c).render(<Search />); await tick(300); LOG.length = 0;
  let commits = 0; const mo = new MutationObserver(() => commits++); mo.observe(c, { subtree: true, childList: true, characterData: true, attributes: true });
  const input = c.querySelector('input')!; const type = (v: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, v); input.dispatchEvent(new Event('input', { bubbles: true })); };
  type('a'); setTimeout(() => { LOG.push('-- type b'); type('ab'); }, 30); await tick(800);
  console.log('R4c', LOG.join('\n  ')); 
});
