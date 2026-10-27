const fns: Array<() => number> = [];
for (var i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map((f) => f())); // [3, 3, 3]
