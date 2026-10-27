export function Plain({ a }) { return <b>{a}</b>; }
export function Marked({ a }) { "use memo"; return <b>{a}</b>; }
export function Off({ a }) { "use no memo"; return <b>{a}</b>; }
export function useThing(a) { "use memo"; return a * 2; }
export function util(a) { "use memo"; return [a]; }
export function util2(a) { return [a]; }
