export {};
function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "rect":   return s.width * s.height;
    default: {
      const _exhaustive: never = s;   // compile error if a variant is unhandled
      return _exhaustive;
    }
  }
}
