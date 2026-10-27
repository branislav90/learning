type OutboxCommand =
  | { id: string; type: 'rename'; docId: string; name: string; createdAt: number }
  | { id: string; type: 'delete'; docId: string; createdAt: number };

function createOutbox(deps: { storage: KeyValueStore; send(cmd: OutboxCommand): Promise<void> }) {
  const KEY = 'outbox';
  const load = (): OutboxCommand[] => { try { return JSON.parse(deps.storage.get(KEY) ?? '[]'); } catch { return []; } };
  const save = (q: OutboxCommand[]) => deps.storage.set(KEY, JSON.stringify(q));

  return {
    enqueue(cmd: OutboxCommand) { save([...load(), cmd]); },
    async drain() {
      let queue = load();
      while (queue.length > 0) {
        const [head, ...rest] = queue;
        try { await deps.send(head); }               // server dedupes by head.id (idempotency key)
        catch { return; }                            // stop; retry later (online event / backoff)
        queue = rest; save(queue);
      }
    },
  };
}
export {};
