import type { Priority, SortKey, Stats, Ticket } from '../types';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const MINUTE = 60_000;
const DAY = 86_400_000;

/** Relative age ("3 hours ago"). `now` is injected so callers control the update rate. */
export function formatAge(iso: string, now: number): string {
  // Clamp to the past: `now` comes from a 1-minute clock and can be up to a minute stale, so a ticket created
  // just now (the live feed) would otherwise read "in 1 minute" (verified).
  const minutes = Math.min(0, Math.round((Date.parse(iso) - now) / MINUTE));
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
}

export function computeStats(tickets: readonly Ticket[], now: number): Stats {
  const byStatus: Record<string, number> = { open: 0, pending: 0, resolved: 0 };
  const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  let ageSum = 0;
  for (const t of tickets) {
    byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
    byPriority[t.priority] = (byPriority[t.priority] ?? 0) + 1;
    ageSum += now - Date.parse(t.createdAt);
  }
  return {
    total: tickets.length,
    byStatus,
    byPriority,
    avgAgeDays: tickets.length ? ageSum / tickets.length / DAY : 0,
  };
}

/** Groups by UTC day (ISO prefix). The original used local-time days; document or restore with Intl if that matters. */
export function ticketsPerDay(tickets: readonly Ticket[]): { day: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of tickets) {
    const day = t.createdAt.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0))
    .slice(-14);
}

const PRIORITY_RANK: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export function compareTickets(key: SortKey): (a: Ticket, b: Ticket) => number {
  return (a, b) => {
    switch (key) {
      case 'createdAt': // ISO-8601 strings in a uniform format sort chronologically; newest first
        return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
      case 'priority':
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      case 'title':
        return a.title.localeCompare(b.title);
    }
  };
}
