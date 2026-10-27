type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type Shape = { kind: 'a'; a: string; shared: number } | { kind: 'b'; b: string; shared: number };
type Wrong = Omit<Shape, 'shared'>;                // { kind: 'a' | 'b' } — loses a/b (only common keys remain)
type Right = DistributiveOmit<Shape, 'shared'>;    // { kind:'a'; a:string } | { kind:'b'; b:string }
export {};
