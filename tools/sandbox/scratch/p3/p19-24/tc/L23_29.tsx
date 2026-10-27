export {};
// 🔴 infinite loop
function C({ a }: { a: number }) { const [b, setB] = useState(0); setB(a); ... }
// ✅ the documented "adjust state during render" pattern is guarded by a comparison
if (a !== prevA) { setPrevA(a); setB(a); }
