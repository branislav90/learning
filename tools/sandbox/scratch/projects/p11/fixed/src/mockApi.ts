import type { Comment, Priority, Status, Ticket, TicketDetailData } from './types';

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!;

const SUBJECTS = ['Login', 'Invoice', 'Export', 'Dashboard', 'Password', 'Billing', 'Sync', 'Upload', 'Webhook', 'Permissions'];
const PROBLEMS = ['fails', 'is slow', 'shows wrong total', 'crashes', 'returns 500', 'does not load', 'is missing'];
const PEOPLE = ['Ada', 'Grace', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Ken', 'Radia'];
const STATUSES: readonly Status[] = ['open', 'pending', 'resolved'];
const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];
const DAY = 86_400_000;
const BASE = Date.now();

function makeTicket(id: number): Ticket {
  return {
    id,
    title: `${pick(SUBJECTS)} ${pick(PROBLEMS)} (#${id})`,
    requester: pick(PEOPLE),
    status: pick(STATUSES),
    priority: pick(PRIORITIES),
    createdAt: new Date(BASE - Math.floor(rand() * 60 * DAY)).toISOString(),
    assignee: rand() > 0.5 ? pick(PEOPLE) : null,
  };
}

const DB: Ticket[] = Array.from({ length: 5000 }, (_, i) => makeTicket(i + 1));

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); },
      { once: true },
    );
  });
}

export async function fetchTickets(signal?: AbortSignal): Promise<Ticket[]> {
  await sleep(400, signal);
  return DB.map((t) => ({ ...t }));
}

/** Longer queries are answered FASTER (shorter queries scan "more"), as often happens with real search backends. */
export async function searchTickets(query: string, signal?: AbortSignal): Promise<Ticket[]> {
  await sleep(Math.max(100, 1200 - query.length * 250), signal);
  const needle = query.toLowerCase();
  return DB.filter((t) => t.title.toLowerCase().includes(needle) || t.requester.toLowerCase().includes(needle)).map((t) => ({ ...t }));
}

/** Even ids are slow, odd ids are fast. */
export async function fetchTicketDetail(id: number, signal?: AbortSignal): Promise<TicketDetailData> {
  await sleep(id % 2 === 0 ? 900 : 100, signal);
  const r = mulberry32(id);
  const n = 3 + Math.floor(r() * 4);
  const comments: Comment[] = Array.from({ length: n }, (_, i) => ({
    id: id * 100 + i,
    author: PEOPLE[Math.floor(r() * PEOPLE.length)]!,
    body: `Comment ${i + 1} on ticket #${id}.`,
    createdAt: new Date(BASE - Math.floor(r() * 5 * DAY)).toISOString(),
  }));
  return { id, description: `Detailed description for ticket #${id}.`, comments };
}

let liveId = 100_000;
export function nextLiveTicket(): Ticket {
  liveId += 1;
  return {
    id: liveId,
    title: `Live: ${pick(SUBJECTS)} ${pick(PROBLEMS)} (#${liveId})`,
    requester: pick(PEOPLE),
    status: 'open',
    priority: pick(PRIORITIES),
    createdAt: new Date().toISOString(),
    assignee: null,
  };
}
