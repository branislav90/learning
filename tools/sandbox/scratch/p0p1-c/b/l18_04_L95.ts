export {};
const o2 = { k: "a" } as const;        // { readonly k: "a" }
const dirs = ["up", "down"] as const;  // readonly ["up", "down"]
type Dir = (typeof dirs)[number];      // "up" | "down"
