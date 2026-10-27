type Status = 'idle' | 'submitting' | 'failure' | 'success';
type EventName = 'SUBMIT' | 'RESOLVE' | 'REJECT' | 'RETRY' | 'RESET';

const transitions = {
  idle:       { SUBMIT: 'submitting' },
  submitting: { RESOLVE: 'success', REJECT: 'failure' },
  failure:    { RETRY: 'submitting', RESET: 'idle' },
  success:    { RESET: 'idle' },
} as const satisfies Record<Status, Partial<Record<EventName, Status>>>;

export function next(status: Status, event: EventName): Status {
  // Index with a widened type; absent entries mean "ignored".
  const row: Partial<Record<EventName, Status>> = transitions[status];
  return row[event] ?? status;
}
export {};
