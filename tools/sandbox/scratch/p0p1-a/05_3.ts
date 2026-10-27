var total = 0;
function add(n: number) {
  total += n;
  return total;
}
const result = add(2) + add(3);
console.log(result);
