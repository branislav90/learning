import { QueryClient, QueryObserver } from '@tanstack/query-core';
// scaled x1/100 : fail after 1ms, delays 10ms, 20ms ; 'default' retryDelay uses real; so override scaled
const qc = new QueryClient({defaultOptions:{queries:{retryDelay:n=>Math.min(1000*2**n,30000)/100}}});
const t0=Date.now(); let seen=[];
const o = new QueryObserver(qc,{queryKey:['p3'],retry:2,queryFn:()=>new Promise((_,rej)=>setTimeout(()=>rej(new Error('net')),1))});
o.subscribe(r=>seen.push([Date.now()-t0,r.status,r.fetchStatus,r.failureCount]));
await new Promise(r=>setTimeout(r,20));
const s=o.getCurrentResult(); console.log('t~2s', s.status,s.fetchStatus,s.failureCount, s.isLoading);
await new Promise(r=>setTimeout(r,60));
console.log(seen.slice(-3)); 
// P2: gc 
const qc2=new QueryClient();
const o2=new QueryObserver(qc2,{queryKey:['t'],queryFn:async()=>1,staleTime:600,gcTime:100});
let u=o2.subscribe(()=>{}); await new Promise(r=>setTimeout(r,10)); u();
await new Promise(r=>setTimeout(r,150)); 
console.log('after gc: has query', !!qc2.getQueryCache().find({queryKey:['t']}));
const o3=new QueryObserver(qc2,{queryKey:['t'],queryFn:async()=>1,staleTime:600,gcTime:100});
console.log('remount status', o3.getCurrentResult().status);
// isLoading vs isFetching; disabled; skipToken
import { skipToken } from '@tanstack/query-core';
const o4=new QueryObserver(qc2,{queryKey:['sk'],queryFn:skipToken});
console.log('skipToken', o4.getCurrentResult().status,o4.getCurrentResult().fetchStatus);
// mutation default retry
console.log('mutation retry', new QueryClient().defaultMutationOptions({mutationFn:()=>1}).retry);
