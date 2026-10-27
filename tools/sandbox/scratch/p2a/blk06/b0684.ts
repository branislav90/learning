export type Child = { key: string | null; type: string; props?: Record<string, unknown> };
export type Op =
  | { op: "reuse" | "move" | "insert" | "delete" | "update"; id: string };

const shallowEqual = (a: Record<string, unknown> = {}, b: Record<string, unknown> = {}) => {
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.is(a[k], b[k]));
};
// inside plan(): after deciding reuse/move for a hit, add:
//   if (!shallowEqual(hit.c.props, c.props)) ops.push({ op: "update", id });
