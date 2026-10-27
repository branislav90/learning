function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(null);
  });
}

async function renderCooperatively(root: Unit, log: string[], sliceMs = 5): Promise<void> {
  let next: Unit | null = root;
  while (next) {
    const deadline = performance.now() + sliceMs;
    next = workLoop(next, log, () => performance.now() >= deadline);
    if (next) await yieldToBrowser(); // a real task boundary: input & paint can run
  }
}
