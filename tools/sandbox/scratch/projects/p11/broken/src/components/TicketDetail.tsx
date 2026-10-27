import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { fetchTicketDetail } from '../mockApi';
import { useWindowWidth } from '../hooks';
import type { Status, TicketDetailData } from '../types';

export function TicketDetail() {
  const { selectedId, setSelectedId, tickets, updateStatus } = useApp();
  const [data, setData] = useState<TicketDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const width = useWindowWidth();

  useEffect(() => {
    if (selectedId == null) return;
    setLoading(true);
    fetchTicketDetail(selectedId).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [selectedId]);

  const ticket = tickets.find((t) => t.id === selectedId);

  return (
    <aside className={width < 900 ? 'detail compact' : 'detail'} aria-label="Ticket detail">
      <button onClick={() => setSelectedId(null)}>Close</button>
      <h2>{ticket ? ticket.title : 'Ticket'}</h2>
      {ticket && (
        <label>
          Status{' '}
          <select
            value={ticket.status}
            onChange={(e) => updateStatus(ticket.id, e.target.value as Status)}
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      )}
      {loading && <p>Loading…</p>}
      {data && (
        <>
          <p>{data.description}</p>
          <ul>
            {data.comments.map((c) => (
              <li key={Math.random()}>
                <strong>{c.author}</strong>: {c.body}
              </li>
            ))}
          </ul>
        </>
      )}
      <label>
        Reply
        <textarea value={reply} onChange={(e) => setReply(e.target.value)} />
      </label>
    </aside>
  );
}
