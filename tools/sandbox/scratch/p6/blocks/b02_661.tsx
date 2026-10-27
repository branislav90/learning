export function createCoalescingQueue() {
  let running = false;
  let pending: (() => Promise<unknown>) | null = null;
  async function drain() {
    if (running) return;
    running = true;
    while (pending) {
      const task = pending; pending = null;
      try { await task(); } catch { /* surface via task's own handlers */ }
    }
    running = false;
  }
  return (task: () => Promise<unknown>) => { pending = task; void drain(); };
}
export {};
