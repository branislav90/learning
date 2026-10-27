export {};
function Counter({ initial }: { initial: number }) {
  const [n, setN] = useState(initial);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
// parent: <Counter initial={count} />, and count changes from 1 to 5 while mounted
