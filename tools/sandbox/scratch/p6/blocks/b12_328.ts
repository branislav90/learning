// (1) one state variable: 'idle' | 'submitting' | 'failure' | 'success'  (a machine or discriminated union)
// (2) machine holds { selectedIds } only if it affects flow; data in query cache
// (3) analytics as an action
actions: { track: ({ context }) => analytics.track('retry', { attempts: context.attempts }) }
// (4) const actorRef = useActorRef(machine)
// (5) import { createMachine, createActor } from 'xstate';
export {};
