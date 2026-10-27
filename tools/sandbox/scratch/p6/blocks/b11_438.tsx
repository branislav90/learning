const Ctx = createContext(0);
function Child() { console.log('child'); return <p>static</p>; }
function Provider({ children }: { children: React.ReactNode }) {
  const [n, setN] = useState(0);
  return <Ctx value={n}><button onClick={() => setN(n + 1)}>+</button>{children}</Ctx>;
}
export default function App() { return <Provider><Child /></Provider>; }
export {};
