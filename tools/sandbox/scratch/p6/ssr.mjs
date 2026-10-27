import { QueryClient, isServer, dehydrate, defaultShouldDehydrateQuery, HydrationBoundary } from '@tanstack/react-query';
console.log('isServer export:', typeof isServer, isServer, 'defaultShouldDehydrateQuery:', typeof defaultShouldDehydrateQuery);
const qc=new QueryClient({defaultOptions:{queries:{retry:false}}});
const r1=await qc.prefetchQuery({queryKey:['bad'],queryFn:async()=>{throw new Error('x')}}); console.log('prefetchQuery on error resolves with', r1);
try{ await qc.fetchQuery({queryKey:['bad2'],queryFn:async()=>{throw new Error('x')}}) }catch(e){console.log('fetchQuery throws', e.message)}
await qc.prefetchQuery({queryKey:['ok'],queryFn:async()=>({d:new Date(0)})});
const d=dehydrate(qc); console.log('dehydrated keys', d.queries.map(q=>JSON.stringify(q.queryKey)), 'Date kept as', Object.prototype.toString.call(d.queries[0].state.data.d));
console.log('JSON roundtrip date', typeof JSON.parse(JSON.stringify(d)).queries[0].state.data.d);
// streaming pending
const qc2=new QueryClient(); qc2.prefetchQuery({queryKey:['slow'],queryFn:()=>new Promise(r=>setTimeout(()=>r(1),50))});
console.log('pending dehydrated by default?', dehydrate(qc2).queries.length, '| with shouldDehydrateQuery incl pending:', dehydrate(qc2,{shouldDehydrateQuery:q=>defaultShouldDehydrateQuery(q)||q.state.status==='pending'}).queries.length);
