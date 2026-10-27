import { QueryClient, QueryObserver, MutationObserver, onlineManager } from '@tanstack/query-core';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
onlineManager.setOnline(false);
const qc=new QueryClient(); let calls=0;
const o=new QueryObserver(qc,{queryKey:['a'],queryFn:async()=>{calls++;return 1}}); o.subscribe(()=>{}); await sleep(20);
console.log('offline online-mode query:', o.getCurrentResult().status, o.getCurrentResult().fetchStatus, 'calls', calls);
const o2=new QueryObserver(qc,{queryKey:['b'],networkMode:'always',queryFn:async()=>{calls++;return 2}}); o2.subscribe(()=>{}); await sleep(20);
console.log('networkMode always:', o2.getCurrentResult().status, o2.getCurrentResult().fetchStatus);
let mcalls=0; const m=new MutationObserver(qc,{mutationFn:async v=>{mcalls++;return v}}); m.mutate('x').catch(()=>{}); await sleep(20);
console.log('offline mutation:', m.getCurrentResult().status, 'isPaused', m.getCurrentResult().isPaused, 'calls', mcalls);
// offlineFirst: first attempt runs, retries pause
let oc=0; const o3=new QueryObserver(qc,{queryKey:['c'],networkMode:'offlineFirst',retry:2,retryDelay:5,queryFn:async()=>{oc++;throw new Error('x')}}); o3.subscribe(()=>{}); await sleep(60);
console.log('offlineFirst: attempts while offline', oc, o3.getCurrentResult().fetchStatus);
onlineManager.setOnline(true); await qc.resumePausedMutations(); await sleep(60);
console.log('after reconnect: a', o.getCurrentResult().status, o.getCurrentResult().fetchStatus, 'calls', calls, '| mutation', m.getCurrentResult().status, 'mcalls', mcalls);
console.log('onlineManager.isOnline default (node, no navigator.onLine?)', onlineManager.isOnline());
