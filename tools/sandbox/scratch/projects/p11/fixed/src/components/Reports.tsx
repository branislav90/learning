import { useMemo } from 'react';
import { useTickets } from '../state/tickets';
import { ticketsPerDay } from '../lib/format';

export default function Reports() {
  const { tickets } = useTickets();
  const rows = useMemo(() => ticketsPerDay(tickets), [tickets]);
  const max = rows.reduce((m, r) => Math.max(m, r.count), 1);

  return (
    <section aria-label="Reports">
      <h2>Tickets per day (last 14 days with data)</h2>
      <div className="bars">
        {rows.map((r) => (
          <div key={r.day} className="bar" style={{ width: `${(r.count / max) * 100}%` }}>
            {r.day}: {r.count}
          </div>
        ))}
      </div>
    </section>
  );
}
