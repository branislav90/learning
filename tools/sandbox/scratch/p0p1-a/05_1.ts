console.log(typeof a);   // "function"  (declaration fully hoisted)
console.log(b);          // undefined   (var hoisted, not initialized)
try { console.log(c); }  // ReferenceError: Cannot access 'c' before initialization (TDZ)
catch (e) { console.log((e as Error).name); }
function a() {}
var b = 1;
let c = 2;
