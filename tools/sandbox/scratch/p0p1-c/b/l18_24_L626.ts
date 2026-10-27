export {};
function run(items: string[]) {
  let first: string | undefined = items[0];
  if (first !== undefined) {
    items.forEach(() => console.log(first.length));
  }
}
