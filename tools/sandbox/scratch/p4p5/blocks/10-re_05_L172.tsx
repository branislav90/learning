import { useState, type ReactNode, type MouseEvent } from "react";

type Position = { x: number; y: number };

export function Mouse({ children }: { children: (pos: Position) => ReactNode }) {
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  return (
    <div
      style={{ height: 200 }}
      onMouseMove={(e: MouseEvent<HTMLDivElement>) => setPos({ x: e.clientX, y: e.clientY })}
    >
      {children(pos)}
    </div>
  );
}

// usage
<Mouse>{(pos) => <p>{pos.x}, {pos.y}</p>}</Mouse>
export {};
