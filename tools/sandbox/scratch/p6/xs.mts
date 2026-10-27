import { createMachine, createActor, setup, assign, fromPromise } from 'xstate';
const toggle = createMachine({ id:'toggle', initial:'off', states:{ off:{on:{TOGGLE:'on'}}, on:{on:{TOGGLE:'off'}} } });
const a = createActor(toggle); const log:any[]=[]; a.subscribe(s=>log.push(s.value)); a.start(); a.send({type:'TOGGLE'}); a.send({type:'TOGGLE'});
console.log('toggle log', log);

let aborted=false; let calls=0;
(globalThis as any).fetch = (url:string, init:any)=>{ calls++; return new Promise((res,rej)=>{ init.signal.addEventListener('abort',()=>{aborted=true; rej(init.signal.reason)}); if(calls>=0) setTimeout(()=>res({ok:false,status:503}),20) }) };
const submitMachine = setup({
  types:{ context:{} as {attempts:number;error?:string;orderId?:string;order:any}, events:{} as {type:'SUBMIT'}|{type:'RETRY'}|{type:'CANCEL'}, input:{} as {order:any} },
  actors:{ submitOrder: fromPromise(async ({input, signal}:{input:any;signal:AbortSignal})=>{ const res=await fetch('/api/orders',{method:'POST',body:JSON.stringify(input),signal} as any) as any; if(!res.ok) throw new Error(`HTTP ${res.status}`); return {id:'1'} }) },
  guards:{ canRetry: ({context})=>context.attempts<3 },
}).createMachine({ id:'submit', initial:'idle', context:({input})=>({attempts:0,order:input.order}),
 states:{ idle:{on:{SUBMIT:'submitting'}},
  submitting:{ entry: assign({attempts:({context})=>context.attempts+1, error:undefined}), invoke:{src:'submitOrder', input:({context})=>context.order, onDone:{target:'success',actions:assign({orderId:({event})=>event.output.id})}, onError:{target:'failure',actions:assign({error:({event})=>(event.error as Error).message})}}, on:{CANCEL:'idle'} },
  failure:{on:{RETRY:[{guard:'canRetry',target:'submitting'},{target:'exhausted'}],CANCEL:'idle'}},
  exhausted:{on:{CANCEL:'idle'}}, success:{type:'final'} }});
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const m=createActor(submitMachine,{input:{order:{items:[]}}}); m.start();
m.send({type:'SUBMIT'}); await sleep(5); m.send({type:'CANCEL'}); await sleep(5);
console.log('after cancel: state',m.getSnapshot().value,'aborted',aborted, 'attempts', m.getSnapshot().context.attempts);
m.send({type:'SUBMIT'}); await sleep(40); console.log('failure?',m.getSnapshot().value, m.getSnapshot().context.error, m.getSnapshot().context.attempts);
m.send({type:'RETRY'}); await sleep(40); m.send({type:'RETRY'}); await sleep(40); console.log('after 3rd failure', m.getSnapshot().value, m.getSnapshot().context.attempts); m.send({type:'RETRY'}); console.log('after RETRY at 3', m.getSnapshot().value);
console.log('can(RETRY)', m.getSnapshot().can({type:'SUBMIT'}), m.getSnapshot().status);
// final
(globalThis as any).fetch=()=>Promise.resolve({ok:true,json:async()=>({id:'z'})});
const m2=createActor(submitMachine,{input:{order:{}}}); m2.start(); m2.send({type:'SUBMIT'}); await sleep(10);
console.log('success', m2.getSnapshot().value, m2.getSnapshot().status, m2.getSnapshot().context.orderId, 'output', m2.getSnapshot().output);
// ordering: exit -> transition actions -> entry
const order:string[]=[];
const mm=createMachine({initial:'a',states:{a:{exit:()=>order.push('exit a'),on:{GO:{target:'b',actions:()=>order.push('transition action')}}},b:{entry:()=>order.push('entry b')}}});
const x=createActor(mm).start(); x.send({type:'GO'}); console.log(order);
// assign visibility inside same step
const o2:string[]=[];
const m3=createMachine({context:{n:0},initial:'a',states:{a:{on:{GO:{actions:[({context})=>o2.push('before assign n='+context.n), assign({n:({context})=>context.n+1}), ({context})=>o2.push('after assign n='+context.n)]}}}}});
const y=createActor(m3).start(); y.send({type:'GO'}); console.log(o2);
