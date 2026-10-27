export {};
function g(x: string | undefined) {
  if (!x) return;   // x: string after this line (also excludes "")
  x.toUpperCase();  // OK
}
