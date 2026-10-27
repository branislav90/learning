type Todo = { id: string; title: string; done: boolean };
type Pending =
  | { kind: 'toggle'; mutationId: string; id: string; done: boolean; status: 'inflight' | 'unknown' }
  | { kind: 'add'; mutationId: string; todo: Todo; status: 'inflight' | 'unknown' };

function applyPending(server: readonly Todo[], pending: readonly Pending[]): Array<Todo & { pending?: boolean }> {
  let view: Array<Todo & { pending?: boolean }> = [...server];
  for (const p of pending) {                              // replay in click order
    if (p.kind === 'toggle') view = view.map((t) => (t.id === p.id ? { ...t, done: p.done, pending: true } : t));
    else if (!view.some((t) => t.id === p.todo.id)) view = [...view, { ...p.todo, pending: true }];  // dedupe once confirmed
  }
  return view;
}

type Action =
  | { type: 'server-loaded'; todos: Todo[] }
  | { type: 'mutation-started'; mutation: Pending }
  | { type: 'mutation-settled'; mutationId: string; outcome: 'ok' | 'failed' | 'unknown'; confirmed?: Todo }
  ;

interface State { server: Todo[]; pending: Pending[]; errors: string[] }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'server-loaded': return { ...s, server: a.todos };
    case 'mutation-started': return { ...s, pending: [...s.pending, a.mutation] };
    case 'mutation-settled': {
      const rest = s.pending.filter((m) => m.mutationId !== a.mutationId);
      if (a.outcome === 'ok') {
        const server = a.confirmed
          ? s.server.some((t) => t.id === a.confirmed!.id)
            ? s.server.map((t) => (t.id === a.confirmed!.id ? a.confirmed! : t))
            : [...s.server, a.confirmed]
          : s.server;
        return { ...s, server, pending: rest };
      }
      if (a.outcome === 'unknown') {
        return { ...s, pending: s.pending.map((m) => (m.mutationId === a.mutationId ? { ...m, status: 'unknown' } : m)) };
      }
      return { ...s, pending: rest, errors: [...s.errors, `Change ${a.mutationId} failed and was reverted.`] };
    }
  }
}
export {};
