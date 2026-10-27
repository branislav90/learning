import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const db={1:{id:1,status:'open',note:'a'},2:{id:2,status:'open',note:'b'}}; const log=[]; let failNext=false;
const baseQuery=async(args)=>{ const a=typeof args==='string'?{url:args}:args; log.push((a.method||'GET')+' '+a.url); await sleep(20);
  if(a.method==='PATCH'){ if(failNext) return {error:{status:500}}; const id=+a.url.split('/')[1]; db[id]={...db[id],...a.body}; return {data:db[id]} }
  if(a.url==='orders') return {data:Object.values(db)}; return {data:db[+a.url.split('/')[1]]} };
const api=createApi({reducerPath:'ordersApi',baseQuery,tagTypes:['Order'],endpoints:b=>({
  getOrders:b.query({query:a=>({url:'orders',params:a??undefined}),providesTags:r=>r?[...r.map(o=>({type:'Order',id:o.id})),{type:'Order',id:'LIST'}]:[{type:'Order',id:'LIST'}]}),
  getOrder:b.query({query:id=>`orders/${id}`,providesTags:(_r,_e,id)=>[{type:'Order',id}]}),
  updateNote:b.mutation({query:({id,...body})=>({url:`orders/${id}`,method:'PATCH',body}),invalidatesTags:(_r,_e,{id})=>[{type:'Order',id}],
    async onQueryStarted({id,note},{dispatch,queryFulfilled}){ const patch=dispatch(api.util.updateQueryData('getOrder',id,d=>{d.note=note})); try{await queryFulfilled}catch{patch.undo()} }}),
})});
const store=configureStore({reducer:{[api.reducerPath]:api.reducer},middleware:gd=>gd().concat(api.middleware)});
const subs=[store.dispatch(api.endpoints.getOrders.initiate()),store.dispatch(api.endpoints.getOrder.initiate(1))];
await sleep(50); log.push('--- mutate success');
const p=store.dispatch(api.endpoints.updateNote.initiate({id:1,note:'X'})); await sleep(5);
log.push('optimistic note: '+api.endpoints.getOrder.select(1)(store.getState()).data.note); await p; await sleep(80);
log.push('after: '+api.endpoints.getOrder.select(1)(store.getState()).data.note);
log.push('--- mutate fail'); failNext=true;
const p2=store.dispatch(api.endpoints.updateNote.initiate({id:1,note:'Y'})); await sleep(5);
log.push('optimistic note: '+api.endpoints.getOrder.select(1)(store.getState()).data.note); await p2; await sleep(60);
log.push('after fail: '+api.endpoints.getOrder.select(1)(store.getState()).data.note);
console.log(log.join('\n'));
// keepUnusedDataFor
console.log('config keepUnusedDataFor', store.getState().ordersApi.config.keepUnusedDataFor, 'invalidationBehavior', store.getState().ordersApi.config.invalidationBehavior, 'refetchOnFocus', store.getState().ordersApi.config.refetchOnFocus);
subs.forEach(s=>s.unsubscribe());
