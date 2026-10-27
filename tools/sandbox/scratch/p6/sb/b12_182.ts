import { createMachine, createActor } from 'xstate';

const toggle = createMachine({
  id: 'toggle',
  initial: 'off',
  states: {
    off: { on: { TOGGLE: 'on' } },
    on: { on: { TOGGLE: 'off' } },
  },
});

const actor = createActor(toggle);
actor.subscribe((snap) => console.log(snap.value));
actor.start();                 // logs 'off' (initial snapshot is emitted on start; verify)
actor.send({ type: 'TOGGLE' }); // logs 'on'
actor.send({ type: 'TOGGLE' }); // logs 'off'
export {};
