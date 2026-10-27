const a = { n: 1 };
const b = a;           // b and a refer to the same object
b.n = 2;
console.log(a.n);      // 2
console.log(a === b);  // true
const c = { n: 2 };
console.log(a === c);  // false (equal shape, different object)
