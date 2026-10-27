type Doc = { title: string; blocks: readonly { id: string; text: string; bold: boolean }[] };

export const setTitle = (from: string, to: string): Command<Doc> => ({
  label: 'Rename document',
  mergeKey: 'title',
  apply: (d) => (d.title === to ? d : { ...d, title: to }),
  revert: (d) => ({ ...d, title: from }),
});

export const toggleBold = (blockId: string): Command<Doc> => {
  const flip = (d: Doc): Doc => ({
    ...d,
    blocks: d.blocks.map((b) => (b.id === blockId ? { ...b, bold: !b.bold } : b)),
  });
  return { label: 'Toggle bold', apply: flip, revert: flip };       // self-inverse operation
};
export {};
