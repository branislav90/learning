// Variant 1: Context
const Ctx = createContext<{ a: number; b: number } | null>(null);
function Provider({ children }: { children: ReactNode }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  return <Ctx value={{ a, b }}>{children}</Ctx>; // and setA/setB exposed elsewhere
}
function A() { const { a } = use(Ctx)!; return <p>{a}</p>; }
function B() { const { b } = use(Ctx)!; return <p>{b}</p>; }

// Variant 2: Zustand
const useStore = create<{ a: number; b: number }>(() => ({ a: 0, b: 0 }));
function A2() { const a = useStore((s) => s.a); return <p>{a}</p>; }
function B2() { const b = useStore((s) => s.b); return <p>{b}</p>; }
export {};
