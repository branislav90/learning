export {};
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("ab", "abc");        // string
longest([1], [1, 2]);        // number[]
// longest(1, 2);            // error: number has no 'length'
