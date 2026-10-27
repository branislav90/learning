function App() {
  return (
    <>
      <Header />
      <Counter />
    </>
  );
}
function Header() { return <h1>Shop</h1>; }
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>Count: {n}</button>;
}
