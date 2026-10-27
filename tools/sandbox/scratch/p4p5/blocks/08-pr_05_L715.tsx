const Ctx = createContext(0);
function Provider() {
  const [n, setN] = useState(0);
  return (
    <Ctx value={n}>
      <button onClick={() => setN((x) => x + 1)}>+</button>
      <Outer />
    </Ctx>
  );
}
const Outer = memo(function Outer() { return <Inner />; });
function Inner() { useContext(Ctx); return null; }
export {};
