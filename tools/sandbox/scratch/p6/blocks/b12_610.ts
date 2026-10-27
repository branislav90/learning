import { setup, assign, fromPromise } from 'xstate';

export const searchMachine = setup({
  types: {
    context: {} as { q: string; results: string[]; error?: string },
    events: {} as { type: 'INPUT'; q: string },
  },
  actors: {
    search: fromPromise(async ({ input, signal }: { input: { q: string }; signal: AbortSignal }) => {
      const r = await fetch(`/api/search?q=${encodeURIComponent(input.q)}`, { signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()) as string[];
    }),
  },
  delays: { debounce: 300 },
}).createMachine({
  context: { q: '', results: [] },
  initial: 'idle',
  on: {
    INPUT: { target: '.typing', reenter: true, actions: assign({ q: ({ event }) => event.q }) },
  },
  states: {
    idle: {},
    typing: { after: { debounce: 'searching' } },
    searching: {
      invoke: {
        src: 'search',
        input: ({ context }) => ({ q: context.q }),
        onDone: { target: 'results', actions: assign({ results: ({ event }) => event.output }) },
        onError: { target: 'error', actions: assign({ error: ({ event }) => String((event.error as Error).message) }) },
      },
    },
    results: {},
    error: {},
  },
});
export {};
