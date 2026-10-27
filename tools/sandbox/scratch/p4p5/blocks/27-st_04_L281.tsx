// ❌ The scanner cannot see these class names
function Gap({ n }: { n: number }) { return <div className={`gap-${n}`} />; }

// ✔ Closed mapping; every class appears literally in source
const gapClass = { 1: "gap-1", 2: "gap-2", 4: "gap-4" } as const;
function Gap({ n }: { n: keyof typeof gapClass }) { return <div className={gapClass[n]} />; }
export {};
