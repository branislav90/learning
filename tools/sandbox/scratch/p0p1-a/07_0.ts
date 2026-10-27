function greet(name: string) { return `Hi ${name}`; }

const alias = greet;                       // assign to variables
const table = { greet, shout: (n: string) => greet(n).toUpperCase() }; // store in objects
[greet].map((f) => f("Ada"));              // put in arrays, pass as arguments
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) => f(g(a)); // return from functions
greet.displayName = "Greeter";             // functions are objects: they can carry properties
console.log(greet.name, greet.length);     // "greet" 1  (name and arity are properties)
console.log(typeof greet, greet instanceof Object); // "function" true
