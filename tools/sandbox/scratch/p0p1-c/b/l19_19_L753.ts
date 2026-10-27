export {};
type Wrap<T> = T extends unknown ? { v: T } : never;
type A = Wrap<string | number>;
type B = [string | number] extends [unknown] ? { v: string | number } : never;
