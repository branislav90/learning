export {};
type P = { kind: "a"; x: number } | { kind: "b"; y: string };
function C({ kind, ...rest }: P) {
  return kind === "a" ? rest.x : rest.y;
}
