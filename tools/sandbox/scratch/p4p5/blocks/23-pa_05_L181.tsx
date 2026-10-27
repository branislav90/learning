// Before
<Mouse>{({ x, y }) => <Cursor x={x} y={y} />}</Mouse>

// After
function usePointer() {
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => setP({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}
function Pointer() { const { x, y } = usePointer(); return <Cursor x={x} y={y} />; }
export {};
