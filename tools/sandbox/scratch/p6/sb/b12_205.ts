// submitMachine.ts
import { setup, assign, fromPromise } from 'xstate';

export interface OrderInput { items: { sku: string; qty: number }[] }

export const submitMachine = setup({
  types: {
    context: {} as { attempts: number; error?: string; orderId?: string; order: OrderInput },
    events: {} as { type: 'SUBMIT' } | { type: 'RETRY' } | { type: 'CANCEL' },
    input: {} as { order: OrderInput },
  },
  actors: {
    submitOrder: fromPromise(async ({ input, signal }: { input: OrderInput; signal: AbortSignal }) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as { id: string };
    }),
  },
  guards: {
    canRetry: ({ context }) => context.attempts < 3,
  },
}).createMachine({
  id: 'submit',
  initial: 'idle',
  context: ({ input }) => ({ attempts: 0, order: input.order }),
  states: {
    idle: { on: { SUBMIT: 'submitting' } },
    submitting: {
      entry: assign({ attempts: ({ context }) => context.attempts + 1, error: undefined }),
      invoke: {
        src: 'submitOrder',
        input: ({ context }) => context.order,
        onDone: {
          target: 'success',
          actions: assign({ orderId: ({ event }) => event.output.id }),
        },
        onError: {
          target: 'failure',
          actions: assign({ error: ({ event }) => (event.error as Error).message }),
        },
      },
      on: { CANCEL: 'idle' },        // leaving the state stops (aborts) the invoked promise actor
    },
    failure: {
      on: {
        RETRY: [{ guard: 'canRetry', target: 'submitting' }, { target: 'exhausted' }],
        CANCEL: 'idle',
      },
    },
    exhausted: { on: { CANCEL: 'idle' } },
    success: { type: 'final' },
  },
});
export {};
