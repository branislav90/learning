const fns2: Array<() => number> = [];
for (let i = 0; i < 3; i++) fns2.push(() => i);
console.log(fns2.map((f) => f())); // [0, 1, 2]
