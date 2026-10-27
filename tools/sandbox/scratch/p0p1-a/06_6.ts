function makeCounter() {
  let n = 0;
  return () => ++n;
}
const a = makeCounter();
a(); a();
