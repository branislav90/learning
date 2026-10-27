type Priority = "immediate" | "userBlocking" | "normal" | "low" | "idle";
type Callback = (didTimeout: boolean) => Callback | void;

const TIMEOUT_MS: Record<Priority, number> = {
  immediate: -1,
  userBlocking: 250,
  normal: 5000,
  low: 10000,
  idle: Number.POSITIVE_INFINITY,
};

interface Task {
  id: number;
  callback: Callback | null;
  expiration: number;
}

export class MiniScheduler {
  private queue: Task[] = [];      // kept sorted by (expiration, id); React uses a min-heap
  private nextId = 0;
  private hostScheduled = false;
  private sliceStart = 0;
  private readonly channel = new MessageChannel();

  constructor(private readonly sliceMs = 5) {
    this.channel.port1.onmessage = () => this.performWork();
  }

  schedule(priority: Priority, callback: Callback): Task {
    const task: Task = {
      id: this.nextId++,
      callback,
      expiration: performance.now() + TIMEOUT_MS[priority],
    };
    const i = this.queue.findIndex((t) => t.expiration > task.expiration);
    if (i === -1) this.queue.push(task);
    else this.queue.splice(i, 0, task);
    this.requestHostCallback();
    return task;
  }

  cancel(task: Task): void {
    task.callback = null; // lazily skipped in the loop, like the real Scheduler
  }

  shouldYield(): boolean {
    return performance.now() - this.sliceStart >= this.sliceMs;
  }

  private requestHostCallback(): void {
    if (this.hostScheduled) return;
    this.hostScheduled = true;
    this.channel.port2.postMessage(null);
  }

  private performWork(): void {
    this.hostScheduled = false;
    this.sliceStart = performance.now();
    while (this.queue.length > 0) {
      const task = this.queue[0];
      const didTimeout = task.expiration <= performance.now();
      if (!didTimeout && this.shouldYield()) break; // slice used up and task not overdue
      if (task.callback === null) {                  // cancelled
        this.queue.shift();
        continue;
      }
      const continuation = task.callback(didTimeout);
      if (typeof continuation === "function") {
        task.callback = continuation;                // keep the task, run the rest later
      } else {
        const idx = this.queue.indexOf(task);
        if (idx !== -1) this.queue.splice(idx, 1);
      }
    }
    if (this.queue.length > 0) this.requestHostCallback(); // continue in a NEW macrotask
  }
}

// ---- demo ----
function busy(ms: number): void {
  const end = performance.now() + ms;
  while (performance.now() < end) {}
}

const s = new MiniScheduler();
const log: string[] = [];
let lowDone = 0;
const LOW_CHUNKS = 6;

const lowJob: Callback = () => {
  while (lowDone < LOW_CHUNKS) {
    busy(2);
    lowDone++;
    log.push(`low:${lowDone}`);
    if (lowDone === 1) s.schedule("userBlocking", () => { log.push("urgent"); });
    if (s.shouldYield()) return lowDone < LOW_CHUNKS ? lowJob : undefined;
  }
};

s.schedule("low", lowJob);
setTimeout(() => console.log(log.join(" ")), 100);
