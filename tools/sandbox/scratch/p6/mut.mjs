import { QueryClient, MutationObserver } from '@tanstack/query-core';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const qc=new QueryClient(); const log=[];
const mk=()=>new MutationObserver(qc,{mutationKey:['t'],mutationFn:async v=>{await sleep(v.ms);if(v.fail)throw new Error('f');return v},
 onSettled:(d,e,v)=>{log.push(v.n+' settled, isMutating='+qc.isMutating({mutationKey:['t']}))}});
const a=mk(), b=mk();
await Promise.allSettled([a.mutate({n:'A',ms:20}), b.mutate({n:'B',ms:60,fail:true})]);
console.log(log);
console.log('useMutationState/getAll', qc.getMutationCache().getAll().length);
