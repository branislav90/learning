import { QueryClient, QueryObserver, hashKey, matchQuery } from '@tanstack/query-core';
console.log('hash order-insensitive objects:', hashKey(['a',{x:1,y:2}])===hashKey(['a',{y:2,x:1}]), '| array order matters:', hashKey(['a',[1,2]])!==hashKey(['a',[2,1]]));
const q={queryKey:['projects','list',{status:'a',page:1}]};
const m=(k,exact)=>matchQuery({queryKey:k,exact},{queryKey:q.queryKey,queryHash:hashKey(q.queryKey),state:{}} );
console.log('prefix ["projects"]', m(['projects']), '| ["projects","list"]', m(['projects','list']), '| partial object {status:"a"}', m(['projects','list',{status:'a'}]), '| exact prefix', m(['projects'],true), '| ["project"] (typo)', m(['project']));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const qc=new QueryClient(); let n=0;
const o=new QueryObserver(qc,{queryKey:['k'],queryFn:async()=>++n}); const seen=[]; o.subscribe(r=>seen.push(r.data));
await sleep(20); qc.clear(); await sleep(20);
console.log('after clear: cache size',qc.getQueryCache().getAll().length,'fetch calls',n,'seen',seen);
// invalidateQueries() no filter refetches active only
const qc2=new QueryClient(); let c={a:0,b:0};
const oa=new QueryObserver(qc2,{queryKey:['a'],queryFn:async()=>++c.a}); oa.subscribe(()=>{}); await qc2.prefetchQuery({queryKey:['b'],queryFn:async()=>++c.b}); await sleep(20);
await qc2.invalidateQueries(); console.log('invalidateQueries() all active only', c);
// refetchOnWindowFocus default + staleTime default via observer options
console.log('observer defaults', JSON.stringify({refetchOnWindowFocus:oa.options.refetchOnWindowFocus, refetchOnMount:oa.options.refetchOnMount, refetchOnReconnect:oa.options.refetchOnReconnect, networkMode:oa.options.networkMode, structuralSharing:oa.options.structuralSharing, staleTime:oa.options.staleTime}));
