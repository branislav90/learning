import { QueryClient, QueryClientProvider, useQuery, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { render, screen, act } from '@testing-library/react';
import { Suspense, StrictMode } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
test('tracked props', async()=>{
  const qc=new QueryClient({defaultOptions:{queries:{retry:false}}}); let renders=0; let n=0;
  function C(){ renders++; const {data}=useQuery({queryKey:['t'],queryFn:async()=>{await sleep(10);return {v:1}},staleTime:0}); return <p>{data?.v}</p>}
  const {unmount}=render(<QueryClientProvider client={qc}><C/></QueryClientProvider>);
  await act(async()=>{await sleep(40)}); const r0=renders;
  await act(async()=>{ await qc.refetchQueries({queryKey:['t']}); });
  console.log('renders after load', r0, 'after refetch (isFetching flip, same data)', renders);
});
test('undefined data errors', async()=>{
  const spy=vi.spyOn(console,'error').mockImplementation(()=>{});
  const qc=new QueryClient({defaultOptions:{queries:{retry:false}}});
  function C(){ const q=useQuery({queryKey:['u'],queryFn:async()=>undefined as any}); return <p>{q.status}:{String(q.error?.message)}</p>}
  render(<QueryClientProvider client={qc}><C/></QueryClientProvider>); await act(async()=>{await sleep(30)});
  console.log('undefined result ->', document.body.textContent, '| console.error:', spy.mock.calls.map(c=>String(c[0]).slice(0,120)));
});
test('cache events', async()=>{
  const qc=new QueryClient(); const ev:string[]=[]; qc.getQueryCache().subscribe(e=>ev.push(e.type+':'+(e as any).query?.queryHash));
  await qc.fetchQuery({queryKey:['e'],queryFn:async()=>1}); console.log('events', ev);
});
test('strictmode useQuery requests', async()=>{
  const qc=new QueryClient(); let calls=0;
  function C(){ const q=useQuery({queryKey:['s'],queryFn:async()=>{calls++;return 1}}); return <p>{q.data}</p>}
  render(<StrictMode><QueryClientProvider client={qc}><C/></QueryClientProvider></StrictMode>); await act(async()=>{await sleep(30)});
  console.log('StrictMode useQuery fetch calls', calls);
});
test('useSuspenseQuery siblings parallel', async()=>{
  const qc=new QueryClient(); const started:Record<string,number>={}; const t0=Date.now();
  const mk=(k:string)=>queryOptions({queryKey:[k],queryFn:async()=>{started[k]=Date.now()-t0;await sleep(100);return k}});
  function A(){ const {data}=useSuspenseQuery(mk('a')); return <i>{data}</i>} function B(){ const {data}=useSuspenseQuery(mk('b')); return <i>{data}</i>}
  function Both(){ const a=useSuspenseQuery(mk('x')); const b=useSuspenseQuery(mk('y')); return <i>{a.data+b.data}</i>}
  await act(async()=>{render(<QueryClientProvider client={qc}><Suspense fallback="fb"><A/><B/></Suspense></QueryClientProvider>)});
  await sleep(250); await act(async()=>{});
  console.log('siblings', JSON.stringify(started));
  const s2:any={}; const t1=Date.now();
  const mk2=(k:string)=>queryOptions({queryKey:[k],queryFn:async()=>{s2[k]=Date.now()-t1;await sleep(100);return k}});
  function Both2(){ const a=useSuspenseQuery(mk2('x')); const b=useSuspenseQuery(mk2('y')); return <i>{a.data+b.data}</i>}
  await act(async()=>{render(<QueryClientProvider client={qc}><Suspense fallback="fb"><Both2/></Suspense></QueryClientProvider>)});
  await sleep(350); await act(async()=>{});
  console.log('same component two useSuspenseQuery', JSON.stringify(s2));
});
