// Using a controllable deferred for each request
function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}
// 1. Mock fetch to hand out deferreds in call order.
// 2. Render with query "r"; rerender "re"; rerender "rea".
// 3. Resolve the third, then the first, then the second.
// 4. Assert the DOM shows results for "rea" and never for "r" or "re".
export {};
