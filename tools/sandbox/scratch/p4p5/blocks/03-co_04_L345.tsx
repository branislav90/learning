// A "state holder" wrapper owns frequently-changing state and receives the heavy subtree as children
function MouseTracker({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onPointerMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      <Cursor x={pos.x} y={pos.y} />
      {children}                       {/* same element reference across MouseTracker re-renders */}
    </div>
  );
}

function Page() {
  return (
    <MouseTracker>
      <HeavyChart />                   {/* created by Page; Page does not re-render on pointer move */}
    </MouseTracker>
  );
}
export {};
