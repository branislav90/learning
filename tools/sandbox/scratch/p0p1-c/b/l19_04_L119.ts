export {};
type ToArray<T> = T extends unknown ? T[] : never;
type A = ToArray<string | number>;      // string[] | number[]      (distributed)

type ToArrayND<T> = [T] extends [unknown] ? T[] : never;
type B = ToArrayND<string | number>;    // (string | number)[]      (wrapped: not distributed)
