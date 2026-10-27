import { createMachine, createActor } from 'xstate';
const m=createMachine({initial:'a',states:{a:{on:{GO:'b'}},b:{}}}); const c=createActor(m).start(); let n=0; c.subscribe(()=>n++);
console.log('after subscribe (already started):', n); c.send({type:'NOPE'} as any); console.log('after ignored event:', n); c.send({type:'GO'}); console.log('after GO', n);
