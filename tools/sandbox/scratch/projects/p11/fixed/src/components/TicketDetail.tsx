import { useEffect, useState } from 'react';
import { fetchTicketDetail } from '../mockApi';
import { isAbortError } from '../lib/errors';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { useTicketActions, useTickets } from '../state/tickets';
import { useSetView, useView } from '../state/view';
import type { Status, TicketDetailData } from '../types';

type Load =
  | { phase: 'loading' }
  | { phase: 'ready'; data: TicketDetailData }
  | { phase: 'error' };

/** Outer component picks the identity; inner component owns per-ticket state. `key` makes switching a remount. */
export function TicketDetail() {
  const { selectedId } = useView();
  if (selectedId == null) return null;
  return <DetailBody key={selectedId} id={selectedId} />;
}

function DetailBody({ id }: { id: number }) {
  const { tickets } = useTickets();
  const { updateStatus } = useTicketActions();
  const setView = useSetView();
  const width = useWindowWidth();
  const [load, setLoad] = useState<Load>({ phase: 'loading' }); // fresh per ticket thanks to key
  const [reply, setReply] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetchTicketDetail(id, controller.signal)
      .then((data) => setLoad({ phase: 'ready', data }))
      .catch((e: unknown) => { if (!isAbortError(e)) setLoad({ phase: 'error' }); });
    return () => controller.abort();
  }, [id]);

  const ticket = tickets.find((t) => t.id === id);

  return (
    <aside className={width < 900 ? 'detail compact' : 'detail'} aria-label="Ticket detail">
      <button onClick={() => setView({ selectedId: null })}>Close</button>
      <h2>{ticket ? ticket.title : 'Ticket'}</h2>
      {ticket && (
        <label>
          Status{' '}
          <select value={ticket.status} onChange={(e) => updateStatus(ticket.id, e.target.value as Status)}>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      )}
      {load.phase === 'loading' && <p>Loading…</p>}
      {load.phase === 'error' && <p role="alert">Could not load this ticket.</p>}
      {load.phase === 'ready' && (
        <>
          <p>{load.data.description}</p>
          <ul>
            {load.data.comments.map((c) => (
              <li key={c.id}><strong>{c.author}</strong>: {c.body}</li>
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
