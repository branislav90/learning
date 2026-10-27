export {};
function f(x: string | number) {
  // here: string | number
  if (typeof x === "string") {
    x;            // string
  } else {
    x;            // number
  }
}
