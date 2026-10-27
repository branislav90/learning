async function load(id: string): Promise<string> {
  console.log("A: before await");
  const res = await fetch(`/api/items/${id}`);   // suspend: load's context leaves the stack
  console.log("C: after await");
  return res.text();
}

console.log("1");
const p = load("42");
console.log("B: after calling load()");
