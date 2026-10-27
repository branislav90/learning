console.log(NaN === NaN, Object.is(NaN, NaN));   // false true
console.log(0 === -0, Object.is(0, -0));         // true false
console.log([NaN].includes(NaN), [NaN].indexOf(NaN)); // true -1
