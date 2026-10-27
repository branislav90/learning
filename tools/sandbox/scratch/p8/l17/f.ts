type S = { k: 'a'; a: number } | { k: 'b'; b: string } | { k: 'c' };
export function f(s: S) { switch (s.k) { case 'a': return s.a; case 'b': return s.b; } }
type R = ReturnType<typeof f>; export const r: R = undefined;
