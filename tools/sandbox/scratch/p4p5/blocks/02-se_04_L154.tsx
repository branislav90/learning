// Before: rule is in render
function Price({ cents, taxRate }: { cents: number; taxRate: number }) {
  const total = Math.round(cents * (1 + taxRate));
  return <span>{(total / 100).toFixed(2)}</span>;
}
export {};
