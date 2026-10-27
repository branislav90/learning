import { setup, assign, fromPromise, createActor, waitFor, createMachine } from 'xstate';
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
let aborts=0, fetches:string[]=[];
(globalThis as any).fetch=(u:string,{signal}:any)=>{fetches.push(u);return new Promise((res,rej)=>{signal.addEventListener('abort',()=>{aborts++;rej(signal.reason)});setTimeout(()=>res({ok:true,json:async()=>['r:'+u]}),60)})};
const searchMachine = setup({
  types:{context:{} as {q:string;results:string[];error?:string},events:{} as {type:'INPUT';q:string}},
  actors:{search:fromPromise(async({input,signal}:{input:{q:string};signal:AbortSignal})=>{const r=await fetch(`/api/search?q=${encodeURIComponent(input.q)}`,{signal}) as any;if(!r.ok)throw new Error('x');return (await r.json()) as string[]})},
  delays:{debounce:30},
}).createMachine({context:{q:'',results:[]},initial:'idle',on:{INPUT:{target:'.typing',reenter:true,actions:assign({q:({event})=>event.q})}},
 states:{idle:{},typing:{after:{debounce:'searching'}},searching:{invoke:{src:'search',input:({context})=>({q:context.q}),onDone:{target:'results',actions:assign({results:({event})=>event.output})},onError:{target:'error',actions:assign({error:({event})=>String((event.error as Error).message)})}}},results:{},error:{}}});
const a=createActor(searchMachine).start();
a.send({type:'INPUT',q:'r'}); await sleep(15); a.send({type:'INPUT',q:'re'}); await sleep(15); a.send({type:'INPUT',q:'rea'});
await sleep(45); console.log('state while 1st search in flight', a.getSnapshot().value, fetches);
a.send({type:'INPUT',q:'read'}); console.log('after INPUT during searching', a.getSnapshot().value, 'aborts', aborts);
await sleep(200); console.log('final', a.getSnapshot().value, a.getSnapshot().context.results, fetches);
// idle INPUT
const b=createActor(searchMachine).start(); b.send({type:'INPUT',q:'x'}); console.log('from idle', b.getSnapshot().value);
// ignored event snapshot identity
const m=createMachine({initial:'a',states:{a:{on:{GO:'b'}},b:{}}}); const c=createActor(m).start(); const s1=c.getSnapshot(); let notified=0; c.subscribe(()=>notified++); c.send({type:'NOPE'} as any); console.log('ignored event: same snapshot?', s1===c.getSnapshot(), 'notified', notified);
// provide + waitFor + persisted + tags
const t=createMachine({initial:'a',states:{a:{tags:['loading'],after:{10:'b'}},b:{type:'final'}}}); const d=createActor(t).start();
console.log('hasTag', d.getSnapshot().hasTag('loading')); const fin=await waitFor(d,s=>s.matches('b')); console.log('waitFor', fin.value, fin.status);
const p=createActor(t).start().getPersistedSnapshot(); console.log('persisted keys', Object.keys(p as any)); const r=createActor(t,{snapshot:p}).start(); console.log('restored', r.getSnapshot().value);
// useSelector comparator: default is === ; @xstate/react 6.1
