console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
(async () => { console.log("E"); await null; console.log("F"); })();
console.log("G");
Promise.resolve().then(() => console.log("a1")).then(() => console.log("a2")).then(() => console.log("a3"));
Promise.resolve().then(() => console.log("b1")).then(() => console.log("b2"));
