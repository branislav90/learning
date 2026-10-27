function toggleBetter(id: string) {
  let target = false;
  setTodos((cur) => cur.map((t) => {
    if (t.id !== id) return t;
    target = !t.done;                       // ⚠ updater functions can run twice in StrictMode dev; see note
    return { ...t, done: target };
  }));
  /* ... */
}
export {};
