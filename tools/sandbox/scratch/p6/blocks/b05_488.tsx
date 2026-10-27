const queues = new Map<string, Promise<unknown>>();

export function enqueueFor<T>(entityId: string, task: () => Promise<T>): Promise<T> {
  const prev = queues.get(entityId) ?? Promise.resolve();
  const run = prev.catch(() => undefined).then(task);
  const tail = run.catch(() => undefined);
  queues.set(entityId, tail);
  void tail.then(() => { if (queues.get(entityId) === tail) queues.delete(entityId); });
  return run;
}
export {};
