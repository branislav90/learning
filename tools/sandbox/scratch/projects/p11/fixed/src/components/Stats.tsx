import { useMemo } from 'react';
import { computeStats } from '../lib/format';
import { useTickets } from '../state/tickets';
import { useMinuteClock } from '../state/clock';

export function Stats() {
  const { tickets } = useTickets();
  const now = useMinuteClock();
  const stats = useMemo(() => computeStats(tickets, now), [tickets, now]); // measured: single O(n) pass; memo avoids repeats on unrelated parent renders
  return (
    <section className="stats" aria-label="Statistics">
      <span>Total: {stats.total}</span>
      <span>Open: {stats.byStatus.open ?? 0}</span>
      <span>Pending: {stats.byStatus.pending ?? 0}</span>
      <span>Resolved: {stats.byStatus.resolved ?? 0}</span>
      <span>Urgent: {stats.byPriority.urgent ?? 0}</span>
      <span>Avg age: {stats.avgAgeDays.toFixed(1)} d</span>
    </section>
  );
}
