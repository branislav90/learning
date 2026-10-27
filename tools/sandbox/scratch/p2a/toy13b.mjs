const TIMEOUT_MS = {
  immediate: -1,
  userBlocking: 250,
  normal: 5e3,
  low: 1e4,
  idle: Number.POSITIVE_INFINITY
};
export class MiniScheduler {
  constructor(sliceMs = 5) {
    this.sliceMs = sliceMs;
    this.channel.port1.onmessage = () => this.performWork();
  }
  sliceMs;
  queue = [];
  // kept sorted by (expiration, id); React uses a min-heap
  nextId = 0;
  hostScheduled = false;
  sliceStart = 0;
  channel = new MessageChannel();
  schedule(priority, callback) {
    const task = {
      id: this.nextId++,
      callback,
      expiration: performance.now() + TIMEOUT_MS[priority]
    };
    const i = this.queue.findIndex((t) => t.expiration > task.expiration);
    if (i === -1) this.queue.push(task);
    else this.queue.splice(i, 0, task);
    this.requestHostCallback();
    return task;
  }
  cancel(task) {
    task.callback = null;
  }
  shouldYield() {
    return performance.now() - this.sliceStart >= this.sliceMs;
  }
  requestHostCallback() {
    if (this.hostScheduled) return;
    this.hostScheduled = true;
    this.channel.port2.postMessage(null);
  }
  performWork() {
    this.hostScheduled = false;
    this.sliceStart = performance.now();
    while (this.queue.length > 0) {
      const task = this.queue[0];
      const didTimeout = task.expiration <= performance.now();
      if (!didTimeout && this.shouldYield()) break;
      if (task.callback === null) {
        this.queue.shift();
        continue;
      }
      const continuation = task.callback(didTimeout);
      if (typeof continuation === "function") {
        task.callback = continuation;
      } else {
        const idx = this.queue.indexOf(task);
        if (idx !== -1) this.queue.splice(idx, 1);
      }
    }
    if (this.queue.length > 0) this.requestHostCallback();
  }
}
function busy(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
  }
}
const s = new MiniScheduler();
const log = [];
let lowDone = 0;
const LOW_CHUNKS = 6;
const lowJob = () => {
  while (lowDone < LOW_CHUNKS) {
    busy(2);
    lowDone++;
    log.push(`low:${lowDone}`);
    if (lowDone === 1) s.schedule("userBlocking", () => {
      log.push("urgent");
    });
    if (s.shouldYield()) return lowDone < LOW_CHUNKS ? lowJob : void 0;
  }
};
s.schedule("low", lowJob);
setTimeout(() => {
  console.log("TOY", log.join(" "));
  s.channel.port1.close();
}, 100);
