console.log(Object.is(NaN, NaN), NaN === NaN, Object.is(0, -0), 0 === -0);
console.log([NaN].includes(NaN), new Set([NaN, NaN]).size, new Set([{}, {}]).size);
