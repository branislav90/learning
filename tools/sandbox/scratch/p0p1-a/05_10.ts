let x = "outer";
function show() {
  console.log(x);
  let x = "inner";
}
try { show(); } catch (e) { console.log((e as Error).name); }
