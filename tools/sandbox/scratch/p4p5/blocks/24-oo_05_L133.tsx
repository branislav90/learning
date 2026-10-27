type Money = number; // minor units (cents) to avoid floating errors
type CartLine = { sku: string; unitPrice: Money; qty: number };
type PricingStrategy = (lines: readonly CartLine[]) => Money;

const regular: PricingStrategy = (lines) =>
  lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

const blackFriday: PricingStrategy = (lines) =>
  Math.round(regular(lines) * 0.8);

const strategies = { regular, blackFriday } as const satisfies Record<string, PricingStrategy>;
type StrategyName = keyof typeof strategies;

function CartTotal({ lines, mode }: { lines: readonly CartLine[]; mode: StrategyName }) {
  const total = strategies[mode](lines);
  return <output>{(total / 100).toFixed(2)}</output>;
}
export {};
