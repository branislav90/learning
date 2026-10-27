export async function runWithBudget(tasks: (() => void)[], budgetMs = 8): Promise<void> {
  let i = 0;
  while (i < tasks.length) {
    const start = performance.now();
    do { tasks[i++](); } while (i < tasks.length && performance.now() - start < budgetMs);
    if (i < tasks.length) await new Promise<void>((r) => setTimeout(r, 0));
  }
}
