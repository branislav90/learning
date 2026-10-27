import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchTickets } from '../mockApi';
import { isAbortError } from '../lib/errors';
import type { Status, Ticket } from '../types';

interface TicketsState {
  tickets: readonly Ticket[];
  loaded: boolean;
  loadError: string | null;
}
interface TicketsActions {
  updateStatus: (id: number, status: Status) => void;
  prepend: (ticket: Ticket) => void;
}

const StateCtx = createContext<TicketsState | null>(null);
const ActionsCtx = createContext<TicketsActions | null>(null);

export function useTickets(): TicketsState {
  const v = useContext(StateCtx);
  if (!v) throw new Error('TicketsProvider missing');
  return v;
}
export function useTicketActions(): TicketsActions {
  const v = useContext(ActionsCtx);
  if (!v) throw new Error('TicketsProvider missing');
  return v;
}

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<readonly Ticket[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchTickets(controller.signal)
      .then((data) => { setTickets(data); setLoaded(true); })
      .catch((e: unknown) => { if (!isAbortError(e)) setLoadError(String(e)); });
    return () => controller.abort();
  }, []);

  const state = useMemo(() => ({ tickets, loaded, loadError }), [tickets, loaded, loadError]);

  // setTickets is stable, so these actions never change identity.
  const actions = useMemo<TicketsActions>(
    () => ({
      updateStatus: (id, status) =>
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t))),
      prepend: (ticket) => setTickets((prev) => [ticket, ...prev]),
    }),
    [],
  );

  return (
    <ActionsCtx value={actions}>
      <StateCtx value={state}>{children}</StateCtx>
    </ActionsCtx>
  );
}
