export {};
interface Point { x: number; y: number }
const pt = { x: 1, y: 2, z: 3 };
const a: Point = pt;
const b: Point = { x: 1, y: 2, z: 3 };
const c: Point = { x: 1 };
