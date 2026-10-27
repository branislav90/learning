export const moveBlock = (id: string, from: number, to: number): Command<Doc> => {
  const move = (d: Doc, a: number, b: number): Doc => {
    if (a === b || a < 0 || a >= d.blocks.length || b < 0 || b >= d.blocks.length) return d;
    const blocks = d.blocks.slice();
    const [m] = blocks.splice(a, 1);
    blocks.splice(b, 0, m);
    return { ...d, blocks };
  };
  return { label: 'Move block', apply: (d) => move(d, from, to), revert: (d) => move(d, to, from) };
};
export {};
