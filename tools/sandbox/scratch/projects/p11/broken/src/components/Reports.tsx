import _ from 'lodash';
import { useApp } from '../AppContext';
import { ticketsPerDay } from '../format';

export function Reports() {
  const { tickets, now } = useApp();
  const rows = ticketsPerDay(tickets);
  const max = _.maxBy(rows, 'count')?.count ?? 1;

  return (
    <section aria-label="Reports">
      <h2>Tickets per day (last 14 days with data)</h2>
      <p>As of {new Date(now).toLocaleTimeString()}</p>
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
