import { test } from 'vitest';
import { setup, assign, fromPromise, createActor } from 'xstate';
test('x', async () => {
  const m = setup({
    types: { context: {} as { attempt: number; message: string | null }, events: {} as { type: 'SUBMIT' } | { type: 'RETRY' } | { type: 'RESET' } },
    actors: { submit: fromPromise<{ id: string }, { attempt: number }>(async ({ input }) => { if (input.attempt < 2) throw new Error('x'); return { id: 'r-' + input.attempt }; }) },
    guards: { canRetry: ({ context }) => context.attempt < 3 },
  }).createMachine({
    id: 'c', initial: 'idle', context: { attempt: 0, message: null },
    states: {
      idle: { on: { SUBMIT: 'submitting' } },
      submitting: { entry: assign({ attempt: ({ context }) => context.attempt + 1 }), invoke: { src: 'submit', input: ({ context }) => ({ attempt: context.attempt }), onDone: 'success', onError: { target: 'failure', actions: assign({ message: 'Payment failed' }) } } },
      failure: { on: { RETRY: { guard: 'canRetry', target: 'submitting' }, RESET: 'idle' } },
      success: { type: 'final' },
    },
  });
  const a = createActor(m); a.start();
  const log: string[] = []; a.subscribe(s => log.push(String(s.value) + ':' + s.context.attempt));
  a.send({ type: 'SUBMIT' }); await new Promise(r => setTimeout(r, 10));
  a.send({ type: 'RETRY' }); await new Promise(r => setTimeout(r, 10));
  console.log(log.join(' > '), a.getSnapshot().status);
});
