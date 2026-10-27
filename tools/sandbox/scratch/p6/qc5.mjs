import { QueryClient, QueryObserver } from '@tanstack/query-core';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for (const opts of [undefined,{cancelRefetch:false}]) {
const qc=new QueryClient(); let n=0; const starts=[]; const results=[]; let aborted=0;
qc.setQueryData(['k'],'seed');
const o=new QueryObserver(qc,{queryKey:['k'],queryFn:async({signal})=>{const id=++n; starts.push(id); signal.addEventListener('abort',()=>aborted++); await sleep(id===1?100:20); return 'v'+id}});
o.subscribe(r=>{ if(r.data) results.push(r.data)});   // mounts: stale seed -> background refetch #1
await sleep(10);            // fetch #1 in flight (has data)
await qc.invalidateQueries({queryKey:['k']}, opts);
await sleep(150);
console.log(JSON.stringify(opts), 'starts',starts,'results seen',results,'final',qc.getQueryData(['k']),'aborted signals',aborted);
}
