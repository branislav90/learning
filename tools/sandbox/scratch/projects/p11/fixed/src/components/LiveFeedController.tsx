import { useEffect } from 'react';
import { nextLiveTicket } from '../mockApi';
import { useTicketActions } from '../state/tickets';
import { useView } from '../state/view';

export function LiveFeedController() {
  const { liveEnabled } = useView();
  const { prepend } = useTicketActions();

  useEffect(() => {
    if (!liveEnabled) return;
    const id = setInterval(() => prepend(nextLiveTicket()), 2000);
    return () => clearInterval(id); // Strict Mode: mount, cleanup, mount leaves exactly one interval
  }, [liveEnabled, prepend]);

  return null;
}
