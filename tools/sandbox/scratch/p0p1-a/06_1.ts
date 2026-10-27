function makeCounter() {
  let n = 0;                          // binding in makeCounter's environment
  return {
    inc: () => ++n,                   // closure #1 captures that environment
    get: () => n,                     // closure #2 captures the SAME environment
  };
}
const c1 = makeCounter();
const c2 = makeCounter();
c1.inc(); c1.inc(); c2.inc();
console.log(c1.get(), c2.get());      // 2 1
