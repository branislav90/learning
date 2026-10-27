type S = { step: number; valid: Record<number, boolean> };
type A = { type: "next" } | { type: "back" } | { type: "setValid"; step: number; valid: boolean } | { type: "reset" };
function reducer(s: S, a: A): S {
  switch (a.type) {
    case "next": return s.valid[s.step] ? { ...s, step: s.step + 1 } : s;
    case "back": return s.step > 0 ? { ...s, step: s.step - 1 } : s;
    case "setValid": return { ...s, valid: { ...s.valid, [a.step]: a.valid } };
    case "reset": return { step: 0, valid: {} };
  }
}
export {};
