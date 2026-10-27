import { QueryClient, QueryObserver, dehydrate, hydrate } from '@tanstack/query-core';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let qc=new QueryClient(); let calls=0;
const o=new QueryObserver(qc,{queryKey:['p',1],queryFn:async()=>{calls++;await sleep(30);return 'real'},placeholderData:'placeholder'});
const r=o.getOptimisticResult(o.options); console.log('placeholder: data',r.data,'isPlaceholderData',r.isPlaceholderData,'status',r.status,'cached?',qc.getQueryData(['p',1]));
o.subscribe(()=>{}); await sleep(10); console.log('mid-flight cache', qc.getQueryData(['p',1]), o.getCurrentResult().status, o.getCurrentResult().isPlaceholderData); await sleep(40);
// initialData
qc=new QueryClient(); calls=0;
const o2=new QueryObserver(qc,{queryKey:['i'],queryFn:async()=>{calls++;return 'real'},initialData:'init',staleTime:1000});
o2.subscribe(()=>{}); await sleep(10); console.log('initialData: status',o2.getCurrentResult().status,'cached',qc.getQueryData(['i']),'fetch calls (staleTime 1000)',calls);
qc=new QueryClient(); calls=0;
const o3=new QueryObserver(qc,{queryKey:['i'],queryFn:async()=>{calls++;return 'real'},initialData:'init'}); o3.subscribe(()=>{}); await sleep(10); console.log('initialData, staleTime 0: fetch calls',calls);
// hydrate immediately stale with staleTime 0
const server=new QueryClient(); await server.prefetchQuery({queryKey:['h'],queryFn:async()=>'srv'}); const dh=dehydrate(server);
console.log('dehydrated shape', Object.keys(dh), Object.keys(dh.queries[0]), Object.keys(dh.queries[0].state));
for (const staleTime of [0,60000]) { const client=new QueryClient(); hydrate(client,dh); let c=0; const ob=new QueryObserver(client,{queryKey:['h'],queryFn:async()=>{c++;return 'cli'},staleTime}); ob.subscribe(()=>{}); await sleep(20); console.log('hydrated staleTime',staleTime,'client fetches',c); }
// select stability
const qc7=new QueryClient(); await qc7.prefetchQuery({queryKey:['s'],queryFn:async()=>({a:[1,2,3]})});
const outs=[]; const ob=new QueryObserver(qc7,{queryKey:['s'],queryFn:async()=>({a:[1,2,3]}),select:d=>({n:d.a.length})});
ob.subscribe(r=>outs.push(r.data)); await qc7.refetchQueries({queryKey:['s']}); await sleep(10); console.log('select new object each time but structurally shared:', outs.length, outs.every(x=>x===outs[0]));
