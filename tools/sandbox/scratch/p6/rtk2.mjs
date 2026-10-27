import { configureStore, createSlice, createAsyncThunk, combineSlices } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// return same draft
const s=createSlice({name:'c',initialState:{items:[]},reducers:{added(state,a){state.items.push(a.payload); return state}}});
console.log('mutate + return same draft:', JSON.stringify(s.reducer({items:[]},s.actions.added(1))));
// slice selectors
const cart=createSlice({name:'cart',initialState:{lines:[1,2]},reducers:{},selectors:{selectCount:st=>st.lines.length}});
const root=combineSlices(cart); console.log('slice selectors with root state:', cart.selectors.selectCount(root(undefined,{type:'@@init'})), 'selectSlice exists', typeof cart.selectSlice);
// thunk abort / condition
const t=createAsyncThunk('t/x',async(a,{signal})=>{await sleep(20); if(signal.aborted) throw new Error('late'); return 1},{condition:(a)=>a!=='skip'});
const store=configureStore({reducer:(st={},a)=>{ if(a.type.startsWith('t/x')) globalThis.last=a; return st}});
const pr=store.dispatch(t('go')); pr.abort(); const res=await pr; console.log('aborted ->', res.type, 'meta.aborted', res.meta.aborted, 'error.name', res.error.name, 'msg', res.error.message);
const res2=await store.dispatch(t('skip')); console.log('condition false ->', res2.type, 'meta.condition', res2.meta.condition, 'error.name', res2.error.name);
// RTKQ: invalidated entry without subscribers dropped?
let n=0; const baseQuery=async(a)=>{n++;await sleep(10);return {data:'d'+n}};
const api=createApi({reducerPath:'api',baseQuery,tagTypes:['T'],endpoints:b=>({q:b.query({query:()=>'x',providesTags:['T']}),m:b.mutation({query:()=>({url:'y',method:'POST'}),invalidatesTags:['T']})})});
const st=configureStore({reducer:{api:api.reducer},middleware:gd=>gd().concat(api.middleware)});
const sub=st.dispatch(api.endpoints.q.initiate()); await sub; sub.unsubscribe(); await sleep(5);
console.log('unsubscribed entry before mutation', Object.keys(st.getState().api.queries));
await st.dispatch(api.endpoints.m.initiate()); await sleep(30);
console.log('after tag invalidation (no subscribers): entries', Object.keys(st.getState().api.queries), 'fetch count', n);
// resetApiState aborting in-flight
const sub2=st.dispatch(api.endpoints.q.initiate(undefined,{subscribe:true})); st.dispatch(api.util.resetApiState()); await sleep(40);
console.log('after resetApiState: queries', Object.keys(st.getState().api.queries));
