// constants.ts
export const A_LIMIT = 10;
export const B_DEFAULT = "x";
// a.ts
import { B_DEFAULT } from "./constants";
export const makeA = () => ({ b: B_DEFAULT });
// b.ts
import { A_LIMIT } from "./constants";
export const limitB = A_LIMIT * 2;
export {};
