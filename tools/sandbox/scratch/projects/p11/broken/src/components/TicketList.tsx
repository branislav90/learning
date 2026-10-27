import { useApp } from '../AppContext';
import { TicketRow } from './TicketRow';

export function TicketList() {
  const { visible, selectedId, setSelectedId } = useApp();

  if (visible.length === 0) return <p>No tickets.</p>;

  return (
    <ul className="ticket-list">
      {visible.map((ticket, index) => (
        <TicketRow
          key={index}
          ticket={ticket}
          selected={ticket.id === selectedId}
          onSelect={() => setSelectedId(ticket.id)}
        />
      ))}
    </ul>
  );
}
