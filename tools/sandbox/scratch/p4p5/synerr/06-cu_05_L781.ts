function useCounter() {
  const [n, setN] = useState(0);
  return { n, inc: () => setN(n + 1) };
}
function A() { const c = useCounter(); … }
function B() { const c = useCounter(); … }
export {};
