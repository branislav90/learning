import { memo, useState } from 'react';
import { useApp } from '../AppContext';
import { formatAge } from '../format';
import type { Ticket } from '../types';

interface Props {
  ticket: Ticket;
  selected: boolean;
  onSelect: () => void;
}

export const TicketRow = memo(function TicketRow({ ticket, selected, onSelect }: Props) {
  const { now } = useApp();
  const [starred, setStarred] = useState(false);

  return (
    <li className={selected ? 'row selected' : 'row'} onClick={onSelect}>
      <button
        aria-label={starred ? 'Unstar' : 'Star'}
        aria-pressed={starred}
        onClick={(e) => { e.stopPropagation(); setStarred((s) => !s); }}
      >
        {starred ? '★' : '☆'}
      </button>
      <span className="title">{ticket.title}</span>
      <span className="badge">{ticket.priority}</span>
      <span className="badge">{ticket.status}</span>
      <span className="age">{formatAge(ticket.createdAt, now)}</span>
    </li>
  );
});
