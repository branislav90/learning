import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('empty string child', async () => {
  const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c);
  await act(async () => root.render(<p>Hello {''}, you have {0} items</p>));
  console.log('NODES', [...c.firstChild!.childNodes].map(n => JSON.stringify(n.nodeValue)));
  await act(async () => root.render(<p>{''}</p>)); console.log('SOLE EMPTY', c.firstChild!.childNodes.length);
  await act(async () => root.render(<p>{''}{''}</p>)); console.log('TWO EMPTY', c.firstChild!.childNodes.length);
  await act(async () => root.render(<p>a{''}</p>)); console.log('A+EMPTY', [...c.firstChild!.childNodes].map(n => JSON.stringify(n.nodeValue)));
});
