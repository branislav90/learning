type Priority = "urgent" | "idle";
interface Request { priority: Priority; root: Unit }

class MiniScheduler {
  private idleRoot: Unit | null = null;
  private cursor: Unit | null = null;
  constructor(private log: string[]) {}

  requestUrgent(root: Unit): void {
    // Discard any in-flight idle traversal: its inputs may be stale.
    const hadIdle = this.cursor !== null;
    this.cursor = null;
    let next: Unit | null = root;
    while (next) next = performUnitOfWork(next, this.log); // no yielding
    if (hadIdle && this.idleRoot) this.cursor = this.idleRoot; // restart from the top
  }

  requestIdle(root: Unit): void {
    this.idleRoot = root;
    this.cursor = root;
  }

  // Called from the host's task loop.
  runIdleSlice(sliceMs = 2): boolean {
    if (!this.cursor) return false;
    const deadline = performance.now() + sliceMs;
    let first = true;
    while (this.cursor && (first || performance.now() < deadline)) {
      this.cursor = performUnitOfWork(this.cursor, this.log);
      first = false;
    }
    return this.cursor !== null; // true = more work remains
  }
}
