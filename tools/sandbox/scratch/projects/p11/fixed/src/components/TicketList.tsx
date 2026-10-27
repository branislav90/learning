import { useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TicketRow } from './TicketRow';
import { useVisibleTickets } from '../hooks/useVisibleTickets';
import { useSetView, useView } from '../state/view';

const ROW_HEIGHT = 44; // must equal .row height in CSS

export function TicketList() {
  const { visible, pending } = useVisibleTickets();
  const { selectedId } = useView();
  const setView = useSetView();
  const onSelect = useCallback((id: number) => setView({ selectedId: id }), [setView]); // setView (dispatch) is stable

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: visible.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  return (
    <div ref={scrollRef} className="ticket-list" aria-busy={pending}>
      {visible.length === 0 ? (
        <p>No tickets.</p>
      ) : (
        <div role="list" className="virtual-inner" style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((item) => {
            const ticket = visible[item.index]!;
            return (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                selected={ticket.id === selectedId}
                top={item.start}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
