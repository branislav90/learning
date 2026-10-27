async function f() { console.log(1); await null; console.log(2); }
f(); console.log(3);
