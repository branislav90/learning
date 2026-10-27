function outer() {
  const x = 1;
  return function inner() {
    console.log(typeof x, typeof y);
  };
}
const y = 2;
outer()();
