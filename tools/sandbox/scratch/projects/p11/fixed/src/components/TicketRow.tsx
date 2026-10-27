import { memo, useState } from 'react';
import { Age } from './Age';
import type { Ticket } from '../types';

interface Props {
  ticket: Ticket;
  selected: boolean;
  top: number;
  onSelect: (id: number) => void; // stable identity supplied by the parent
}

export const TicketRow = memo(function TicketRow({ ticket, selected, top, onSelect }: Props) {
  const [starred, setStarred] = useState(false);
  return (
    <div
      role="listitem"
      className={selected ? 'row selected' : 'row'}
      style={{ transform: `translateY(${top}px)` }}
      onClick={() => onSelect(ticket.id)}
    >
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
      <Age iso={ticket.createdAt} />
    </div>
  );
});
