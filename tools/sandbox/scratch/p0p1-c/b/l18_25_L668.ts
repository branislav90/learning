export {};
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":   return Math.PI * s.radius ** 2;
    case "rect":     return s.width * s.height;
    case "triangle": return (s.base * s.height) / 2;
    default: { const _x: never = s; return _x; }
  }
}
