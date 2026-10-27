export {};
function C({ x }: { x: number }) {
  const [a, setA] = useState(0);
  const [prev, setPrev] = useState(x);
  setA(x);                        // (1)
  if (x !== prev) { setPrev(x); } // (2)
  if (x !== prev) { setPrev(x); setA(x); } // (3)
  return null;
}
