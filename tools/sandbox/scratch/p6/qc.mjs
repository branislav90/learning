import * as qcore from '@tanstack/query-core';
import * as rq from '@tanstack/react-query';
const { QueryClient, QueryObserver } = qcore;
console.log('exports', ['queryOptions','infiniteQueryOptions','skipToken','keepPreviousData','useMutationState','useSuspenseQuery','useQueryErrorResetBoundary','QueryErrorResetBoundary','useIsFetching','HydrationBoundary','dehydrate','usePrefetchQuery','useSuspenseQueries','mutationOptions','useIsRestoring','experimental_streamedQuery'].map(k=>k+':'+(k in rq)).join(' '));
const qc = new QueryClient();
const d = qc.getDefaultOptions(); console.log('defaults', JSON.stringify(d));
const ob = new QueryObserver(qc,{queryKey:['a'],queryFn:()=>1});
const r = ob.getCurrentResult(); console.log('initial', r.status, r.fetchStatus, r.isLoading, r.isPending);
const ob2 = new QueryObserver(qc,{queryKey:['b'],queryFn:()=>1,enabled:false});
const r2 = ob2.getCurrentResult(); console.log('disabled', r2.status, r2.fetchStatus, r2.isLoading, r2.isPending);
// retry timings
const t0=Date.now(); let attempts=[]; 
const qc2 = new QueryClient({defaultOptions:{queries:{retryDelay:(n)=>Math.min(1000*2**n,30000)/50}}});
const o3 = new QueryObserver(qc2,{queryKey:['r'],retry:3,queryFn:async()=>{attempts.push(Date.now()-t0);throw new Error('x')}});
o3.subscribe(()=>{});
await new Promise(r=>setTimeout(r,500));
console.log('retry:3 attempts', attempts.length, attempts, o3.getCurrentResult().status);
console.log('default retryDelay fn', qcore.defaultRetryDelay?.(0));
// invalidate refetchType default
const qc3 = new QueryClient(); let calls={act:0,inact:0};
const act = new QueryObserver(qc3,{queryKey:['p','a'],queryFn:async()=>++calls.act}); act.subscribe(()=>{});
await qc3.prefetchQuery({queryKey:['p','b'],queryFn:async()=>++calls.inact});
await new Promise(r=>setTimeout(r,20));
await qc3.invalidateQueries({queryKey:['p']});
console.log('invalidate default refetchType', calls, 'inactive invalidated:', qc3.getQueryState(['p','b']).isInvalidated);
await qc3.invalidateQueries({queryKey:['p'],refetchType:'all'}); console.log('refetchType all', calls);
await qc3.invalidateQueries({queryKey:['p'],refetchType:'none'}); console.log('refetchType none', calls);
// cancelQueries + signal + revert
let aborted=false;
const qc4=new QueryClient();
const p = qc4.fetchQuery({queryKey:['c'],queryFn:({signal})=>new Promise((res,rej)=>{signal.addEventListener('abort',()=>{aborted=true;rej(new Error('aborted'))});setTimeout(()=>res(1),200)})}).catch(e=>e.constructor.name+':'+e.message);
await new Promise(r=>setTimeout(r,10));
await qc4.cancelQueries({queryKey:['c']});
console.log('cancel', aborted, await p, qc4.getQueryState(['c']).status, qc4.getQueryState(['c']).fetchStatus);
// clear
qc4.setQueryData(['z'],1); qc4.clear(); console.log('after clear', qc4.getQueryCache().getAll().length);
// gcTime
console.log('gc default', new qcore.Query({client:qc4,cache:qc4.getQueryCache(),queryKey:['g'],queryHash:'g',options:{}}).gcTime);
// placeholderData identity
console.log('keepPreviousData', typeof qcore.keepPreviousData, qcore.keepPreviousData(5));
// structural sharing
const a={x:{y:1},z:[1,2]}; console.log('replaceData sharing', qcore.replaceEqualDeep(a,{x:{y:1},z:[1,2]})===a);
// mutation callbacks signature
const m = new qcore.MutationObserver(qc4,{mutationFn:async(v)=>v,onMutate:(...args)=>{console.log('onMutate args', args.length, Object.keys(args[1]??{}));return {ctx:1}},onSuccess:(...a)=>console.log('onSuccess args',a.length),onSettled:(...a)=>console.log('onSettled args',a.length, JSON.stringify(a[3]))});
await m.mutate(7);
await new Promise(r=>setTimeout(r,20));
