import { setup, assign } from 'xstate';

export const uploadMachine = setup({
  types: {
    context: {} as { progress: number },
    events: {} as
      | { type: 'START' } | { type: 'PAUSE' } | { type: 'RESUME' }
      | { type: 'PROGRESS'; value: number } | { type: 'OFFLINE' } | { type: 'ONLINE' },
  },
  delays: { retryDelay: 3000 },
}).createMachine({
  id: 'upload',
  type: 'parallel',
  context: { progress: 0 },
  states: {
    transfer: {
      initial: 'idle',
      states: {
        idle: { on: { START: 'running' } },
        running: {
          on: {
            PAUSE: 'paused',
            PROGRESS: { actions: assign({ progress: ({ event }) => event.value }) },
          },
        },
        paused: { on: { RESUME: 'running' } },
      },
    },
    network: {
      initial: 'online',
      states: {
        online: { on: { OFFLINE: 'offline' } },
        offline: {
          on: { ONLINE: 'online' },
          after: { retryDelay: { target: 'offline', reenter: true } },   // delayed self-transition (verify `reenter`)
        },
      },
    },
  },
});
export {};
