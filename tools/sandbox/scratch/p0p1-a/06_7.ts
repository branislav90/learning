function demo() {
  let x = 1;
  const getX = () => x;
  x = 2;
  return getX();
}
console.log(demo());
