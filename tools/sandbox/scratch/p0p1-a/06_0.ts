const label = "global";
function outer() {
  const label = "outer";           // shadows global label inside outer
  function inner() {
    return label;                  // resolves to "outer", where inner was WRITTEN
  }
  return inner();
}
console.log(outer()); // "outer"
