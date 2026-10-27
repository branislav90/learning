import { configureStore, createSlice, createSelector } from '@reduxjs/toolkit';

console.log('NODE_ENV', process.env.NODE_ENV);
const mk=()=>createSlice({name:'s',initialState:{items:[{id:1,q:1},{id:2,q:2},{id:3,q:3}],d:new Date()},reducers:{inc(s){s.items[1].q++}, bad(s){s.items.push({id:9,q:9}); return {items:[],d:s.d}}, nonser(s,a){}}});
const sl=mk();
const store=configureStore({reducer:{s:sl.reducer}});
const before=store.getState(); store.dispatch(sl.actions.inc()); const after=store.getState();
console.log('structural sharing: items[0] same', before.s.items[0]===after.s.items[0], 'items[1] new', before.s.items[1]!==after.s.items[1]);
try{ store.dispatch(sl.actions.bad()) }catch(e){console.log('mutate+return throws:', e.message.slice(0,90))}
console.log('frozen state?', Object.isFrozen(store.getState().s.items), Object.isFrozen(store.getState().s));
const names=store.dispatch.toString().length; 
// middleware list
const mw=[]; const spy=()=>next=>a=>{return next(a)};
const s2=configureStore({reducer:(s={})=>s,middleware:gd=>{const d=gd(); console.log('default middleware count', d.length, d.map(m=>m.name||'anon').join(',')); return d}});
// serializable check
const orig=console.error; const msgs=[]; console.error=(...a)=>msgs.push(String(a[0]).slice(0,100));
const s3=configureStore({reducer:(s={},a)=>a.type==='x'?{...s,v:a.payload}:s});
s3.dispatch({type:'x',payload:new Map()}); console.error=orig; console.log('non-serializable warns:', msgs);
// reselect memoizer
const sel=createSelector([s=>s.a],a=>a); console.log('createSelector memoize', sel.memoize?.name, 'argsMemoize', sel.argsMemoize?.name);
