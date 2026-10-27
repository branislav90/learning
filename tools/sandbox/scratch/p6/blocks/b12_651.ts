import { createActor, fromPromise } from 'xstate';
import { submitMachine } from './submitMachine';

it('fails twice then succeeds', async () => {
  let calls = 0;
  const machine = submitMachine.provide({
    actors: {
      submitOrder: fromPromise(async () => {
        calls += 1;
        if (calls < 3) throw new Error('boom');
        return { id: 'o1' };
      }),
    },
  });
  const actor = createActor(machine, { input: { order: { items: [] } } }).start();
  const settle = () => new Promise((r) => setTimeout(r, 0));
  actor.send({ type: 'SUBMIT' }); await settle();
  actor.send({ type: 'RETRY' });  await settle();
  actor.send({ type: 'RETRY' });  await settle();
  expect(actor.getSnapshot().value).toBe('success');
  expect(actor.getSnapshot().context.attempts).toBe(3);
});
export {};
