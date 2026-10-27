import { expect, it } from 'vitest';
import { historyReducer, initialHistory } from './history';
import { setTitle, toggleBold } from './commands';

const doc0 = { title: 'x', blocks: [{ id: 'a', text: '', bold: false }, { id: 'b', text: '', bold: true }] };

it('undo after exec returns the original state', () => {
  let seed = 42; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32;
  for (let run = 0; run < 100; run++) {
    let h = initialHistory(doc0);
    const n = 1 + Math.floor(rnd() * 10);
    for (let i = 0; i < n; i++) {
      const cmd = rnd() < 0.5 ? setTitle(h.present.title, `t${i}`) : toggleBold(rnd() < 0.5 ? 'a' : 'b');
      h = historyReducer(h, { type: 'EXEC', command: cmd });
    }
    for (let i = 0; i < n + 1; i++) h = historyReducer(h, { type: 'UNDO' });
    expect(h.present).toEqual(doc0);
  }
});
export {};
