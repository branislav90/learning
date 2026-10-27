import { QueryClient, QueryObserver } from '@tanstack/query-core';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// A: signal ignored; cancelQueries
let qc=new QueryClient();
const o=new QueryObserver(qc,{queryKey:['a'],queryFn:async()=>{await sleep(50);return 'late'}}); o.subscribe(()=>{});
await sleep(5); await qc.cancelQueries({queryKey:['a']}); 
console.log('A after cancel', qc.getQueryState(['a']).status, qc.getQueryState(['a']).fetchStatus); await sleep(80);
console.log('A after fn finished', qc.getQueryState(['a']).status, qc.getQueryData(['a']));
// B: signal ignored; unsubscribe
qc=new QueryClient();
let o2=new QueryObserver(qc,{queryKey:['b'],queryFn:async()=>{await sleep(50);return 'late'}}); let u=o2.subscribe(()=>{});
await sleep(5); u(); await sleep(80);
console.log('B unobserved, signal ignored: data cached?', qc.getQueryData(['b']));
// C: signal consumed; unsubscribe
qc=new QueryClient(); let aborted=false;
o2=new QueryObserver(qc,{queryKey:['c'],queryFn:({signal})=>new Promise((res,rej)=>{signal.addEventListener('abort',()=>{aborted=true;rej(new Error('ab'))});setTimeout(()=>res('late'),50)})}); u=o2.subscribe(()=>{});
await sleep(5); u(); await sleep(80);
console.log('C unobserved, signal consumed: aborted',aborted,'data',qc.getQueryData(['c']),qc.getQueryState(['c']).status);
// D: key change -> previous query signal aborted?
// E: mutation retry/ cancelQueries revert to previous data
qc=new QueryClient(); qc.setQueryData(['e'],'old');
const o5=new QueryObserver(qc,{queryKey:['e'],queryFn:async()=>{await sleep(50);return 'new'},staleTime:0}); o5.subscribe(()=>{});
await sleep(5); await qc.cancelQueries({queryKey:['e']}); console.log('E data after cancel',qc.getQueryData(['e']),qc.getQueryState(['e']).fetchStatus);
