const f1 = () => 1;
const f2 = () => 1;
const f3 = f1;
console.log(f1 === f2, f1 === f3);
console.log([f1].includes(f3), [f1].includes(f2));
console.log(JSON.stringify({ f: f1 }));  // functions are skipped by JSON.stringify
