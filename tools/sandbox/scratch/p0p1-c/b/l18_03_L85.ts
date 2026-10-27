export {};
let n = 1;            // number    (let → widened)
const c = 1;          // 1         (const → literal type)
let s = "a";          // string
const o = { k: "a" }; // { k: string }     (properties are mutable → widened)
const t = [1, "a"];   // (string | number)[]
