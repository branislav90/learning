import type { ComponentType, ReactNode } from 'react';

type Discriminated = { type: string };

export function createRegistry<B extends Discriminated>(
  components: { [K in B['type']]: ComponentType<Extract<B, { type: K }>> },
  Fallback: ComponentType<{ block: B }> = () => null,
) {
  function render(block: B): ReactNode {
    const View = (components as Record<string, ComponentType<B> | undefined>)[block.type];
    return View ? <View {...block} /> : <Fallback block={block} />;
  }
  return { render };
}
export {};
