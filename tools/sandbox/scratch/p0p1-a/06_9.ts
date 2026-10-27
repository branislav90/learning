const fns: Array<() => string> = [];
for (var i = 0; i < 3; i++) { let j = i * 2; fns.push(() => `${i}-${j}`); }
console.log(fns.map((f) => f()).join(","));
