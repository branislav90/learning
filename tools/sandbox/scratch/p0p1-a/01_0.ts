// Process 50,000 rows without blocking input for long.
async function processInChunks<T>(
  items: readonly T[],
  work: (item: T) => void,
  budgetMs = 8,
): Promise<void> {
  let i = 0;
  while (i < items.length) {
    const start = performance.now();
    while (i < items.length && performance.now() - start < budgetMs) {
      work(items[i++]);
    }
    // Yield so the browser can handle input and render.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
}
