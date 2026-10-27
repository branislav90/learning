function useMousePosition() {
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

function Coordinates() {
  const pos = useMousePosition();
  return <p>{pos.x}, {pos.y}</p>;
}
export {};
