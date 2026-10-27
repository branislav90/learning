import type { ComponentType } from 'react';

// --- domain union (output of the adapter) ---
interface HeroBlock { type: 'hero'; id: string; headline: string; imageUrl: string }
interface GridBlock { type: 'product_grid'; id: string; skus: string[] }
interface TextBlock { type: 'rich_text'; id: string; html: string }
export type Block = HeroBlock | GridBlock | TextBlock;

// --- registry typed per key ---
type BlockRegistry = {
  [K in Block['type']]: ComponentType<Extract<Block, { type: K }>>;
};

const HeroView: ComponentType<HeroBlock> = ({ headline, imageUrl }) => (
  <section style={{ backgroundImage: `url(${imageUrl})` }}><h1>{headline}</h1></section>
);
const GridView: ComponentType<GridBlock> = ({ skus }) => (
  <ul>{skus.map((s) => <li key={s}>{s}</li>)}</ul>
);
const TextView: ComponentType<TextBlock> = ({ html }) => (
  // html MUST be sanitized by the adapter or a trusted CMS pipeline; see Phase 10 / 06.
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

const blockRegistry = {
  hero: HeroView,
  product_grid: GridView,
  rich_text: TextView,
} satisfies BlockRegistry;

export function PageRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        const View = blockRegistry[block.type] as ComponentType<typeof block>;
        return <View key={block.id} {...block} />;
      })}
    </>
  );
}
export {};
