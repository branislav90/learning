import { setup, assign, fromPromise } from 'xstate';

export const checkoutMachine = setup({
  types: {
    context: {} as { attempt: number; message: string | null },
    events: {} as { type: 'SUBMIT' } | { type: 'RETRY' } | { type: 'RESET' },
  },
  actors: {
    submit: fromPromise<{ id: string }, { attempt: number }>(async ({ input, signal }) => {
      /* call the API; honour `signal` */
      return { id: 'r-' + input.attempt };
    }),
  },
  guards: { canRetry: ({ context }) => context.attempt < 3 },
}).createMachine({
  id: 'checkout',
  initial: 'idle',
  context: { attempt: 0, message: null },
  states: {
    idle: { on: { SUBMIT: 'submitting' } },
    submitting: {
      entry: assign({ attempt: ({ context }) => context.attempt + 1 }),
      invoke: {
        src: 'submit',
        input: ({ context }) => ({ attempt: context.attempt }),
        onDone: 'success',
        onError: { target: 'failure', actions: assign({ message: 'Payment failed' }) },
      },
    },
    failure: { on: { RETRY: { guard: 'canRetry', target: 'submitting' }, RESET: 'idle' } },
    success: { type: 'final' },
  },
});
export {};
