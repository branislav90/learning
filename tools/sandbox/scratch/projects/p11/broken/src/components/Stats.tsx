import { useApp } from '../AppContext';

export function Stats() {
  const { stats } = useApp();
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
