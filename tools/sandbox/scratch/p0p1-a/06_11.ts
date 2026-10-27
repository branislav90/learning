function createCounter() { let c = 0; return () => ++c; }
const a = createCounter(), b = createCounter();
console.log(a(), a(), b());
