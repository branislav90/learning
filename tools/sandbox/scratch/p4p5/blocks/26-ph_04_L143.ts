// a.ts
import { b } from "./b";
export const a = "A";
console.log(b);
// b.ts
import { a } from "./a";
export const b = "B" + a;
// main.ts
import "./a";
export {};
