const useC = create<{ a: number; b: number; inc: () => void }>()((set) => ({ a: 0, b: 0, inc: () => set((s) => ({ a: s.a + 1 })) }));
const A = () => <p>{useC((s) => s.a)}</p>;
const B = () => <p>{useC((s) => s.b)}</p>;
const C = () => { const { a, b } = useC(); return <p>{a + b}</p>; };
export {};
