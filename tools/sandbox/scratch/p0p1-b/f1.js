async function a() { console.log("a1"); await b(); console.log("a2"); }
async function b() { console.log("b1"); return Promise.resolve("x"); }
a(); Promise.resolve().then(() => console.log("p1")).then(() => console.log("p2")).then(() => console.log("p3"));
