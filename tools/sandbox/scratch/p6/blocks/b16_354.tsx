// outbox.ts
import { openDB, type DBSchema } from 'idb';

type OutboxStatus = 'pending' | 'in-flight' | 'conflict' | 'failed';

interface OutboxItem {
  id: string;               // also the Idempotency-Key
  type: 'COMPLETE_JOB' | 'ADD_NOTE';
  payload: unknown;
  createdAt: number;
  status: OutboxStatus;
  attempts: number;
  baseVersion?: string;     // ETag/version the user edited from
}

interface OutboxDB extends DBSchema {
  outbox: { key: string; value: OutboxItem; indexes: { 'by-created': number } };
}

const dbPromise = openDB<OutboxDB>('app-outbox', 1, {
  upgrade(db) {
    const store = db.createObjectStore('outbox', { keyPath: 'id' });
    store.createIndex('by-created', 'createdAt');
  },
});

export async function enqueue(type: OutboxItem['type'], payload: unknown, baseVersion?: string) {
  const item: OutboxItem = {
    id: crypto.randomUUID(), type, payload, createdAt: Date.now(),
    status: 'pending', attempts: 0, baseVersion,
  };
  await (await dbPromise).put('outbox', item); // durable BEFORE any network or optimistic work
  return item;
}

const handlers: Record<OutboxItem['type'], (item: OutboxItem) => Promise<Response>> = {
  COMPLETE_JOB: (i) => fetch(`/api/jobs/${(i.payload as { jobId: number }).jobId}/complete`, {
    method: 'POST',
    headers: { 'Idempotency-Key': i.id, ...(i.baseVersion ? { 'If-Match': i.baseVersion } : {}) },
  }),
  ADD_NOTE: (i) => fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': i.id },
    body: JSON.stringify(i.payload),
  }),
};

let draining = false;

export async function drain(onSettled: () => void) {
  if (draining) return; // single runner per tab
  draining = true;
  try {
    const db = await dbPromise;
    const items = await db.getAllFromIndex('outbox', 'by-created'); // preserve user's order
    for (const item of items) {
      if (item.status === 'conflict' || item.status === 'failed') continue;
      let res: Response;
      try {
        res = await handlers[item.type](item);
      } catch {
        return; // network-level failure: stop, keep order, try again on next trigger
      }
      if (res.ok) await db.delete('outbox', item.id);
      else if (res.status === 409 || res.status === 412) await db.put('outbox', { ...item, status: 'conflict' });
      else if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429)
        await db.put('outbox', { ...item, status: 'failed' });
      else return; // 5xx / 429: stop and retry later with backoff
      item.attempts += 1;
    }
  } finally {
    draining = false;
    onSettled();
  }
}

window.addEventListener('online', () => void drain(() => {}));
export {};
