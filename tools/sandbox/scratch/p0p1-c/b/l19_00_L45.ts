export {};
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);       // T inferred as number → n: number | undefined
const s = first(["a", "b"]);      // T inferred as string
const e = first([]);              // T inferred as never → e: undefined (empty literal array is never[])
