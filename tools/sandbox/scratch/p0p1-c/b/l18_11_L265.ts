export {};
let id: string | undefined = getId();
if (id !== undefined) {
  setTimeout(() => id.length, 0);   // error on older versions: id may be undefined in the callback
}
