// serial-queue.ts
export function createSerialQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task, task);     // run even if the previous task failed
    tail = run.catch(() => undefined);     // keep the chain alive; callers see their own result
    return run;
  };
}

const saveTitleQueue = createSerialQueue();

export function saveTitle(id: string, title: string) {
  return saveTitleQueue(() =>
    fetch(`/api/docs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
  );
}
export {};
