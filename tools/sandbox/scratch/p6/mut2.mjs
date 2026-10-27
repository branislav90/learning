import { QueryClient, QueryObserver, MutationObserver } from '@tanstack/query-core';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for (const ret of [true,false]) {
  const qc=new QueryClient(); const o=new QueryObserver(qc,{queryKey:['l'],queryFn:async()=>{await sleep(80);return 1}}); o.subscribe(()=>{}); await sleep(100);
  const m=new MutationObserver(qc,{mutationFn:async()=>{await sleep(10);return 'ok'},onSuccess:()=>ret?qc.invalidateQueries({queryKey:['l']}):void qc.invalidateQueries({queryKey:['l']})});
  const p=m.mutate(); await sleep(40);
  console.log('return invalidate promise =',ret,'-> at +40ms mutation status:',m.getCurrentResult().status,'list fetchStatus',o.getCurrentResult().fetchStatus); await p; await sleep(100);
}
