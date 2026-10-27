import { useEffect, useMemo, useState } from 'react';
import { searchTickets } from '../mockApi';
import { compareTickets } from '../lib/format';
import { isAbortError } from '../lib/errors';
import { useTickets } from '../state/tickets';
import { useView } from '../state/view';
import type { Ticket } from '../types';

function useServerSearch(query: string) {
  const [state, setState] = useState<{ query: string; results: Ticket[] } | null>(null);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    searchTickets(query, controller.signal)
      .then((results) => setState({ query, results }))
      .catch((e: unknown) => { if (!isAbortError(e)) console.error(e); });
    return () => controller.abort(); // a newer query (or unmount) cancels this one
  }, [query]);

  return {
    results: query ? (state?.results ?? null) : null,   // no setState-in-effect to clear: derived from `query`
    pending: query !== '' && state?.query !== query,
  };
}

export function useVisibleTickets() {
  const { tickets } = useTickets();
  const { query, status, priority, sortKey } = useView();
  const { results, pending } = useServerSearch(query);

  const visible = useMemo(() => {
    const source = results ?? tickets;
    const filtered = source.filter(
      (t) => (status === 'all' || t.status === status) && (priority === 'all' || t.priority === priority),
    );
    return filtered.sort(compareTickets(sortKey)); // `filter` produced a new array, so sorting it in place is safe
  }, [results, tickets, status, priority, sortKey]);

  return { visible, pending };
}
