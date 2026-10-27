function c() { console.log("in c"); }
function b() { c(); console.log("b done"); }
function a() { b(); console.log("a done"); }
a();
