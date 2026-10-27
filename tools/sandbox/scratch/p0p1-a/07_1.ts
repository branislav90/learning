function make() { return () => 1; }
console.log(make() === make()); // false — two evaluations, two objects
