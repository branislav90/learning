const React=require('react');
const S=require('react-server-dom-webpack/server.node');
const {Readable}=require('stream');
class Foo{constructor(){this.a=1}}
const np=Object.create(null);np.x=1;
const circ={n:1};circ.self=circ;
const shared={s:1};
const cases={
 Date:new Date(0),InvalidDate:new Date(NaN),Map:new Map([[1,{a:1}]]),Set:new Set([1,2]),BigInt:10n,NaN:NaN,Inf:Infinity,NegInf:-Infinity,NegZero:-0,undef:undefined,
 symFor:Symbol.for('x'),symLocal:Symbol('y'),u8:new Uint8Array([1,2,3]),f64:new Float64Array([1.5]),ab:new ArrayBuffer(4),
 cls:new Foo(),clsToJSON:new (class{toJSON(){return {z:1}}}),fn:()=>1,promise:Promise.resolve(5),FormData:(()=>{const f=new FormData();f.append('a','b');return f})(),
 Blob:new Blob(['hi']),iter:(function*(){yield 1;yield 2})(),circ,nullProto:np,err:new Error('boom'),shared:[shared,shared],
 regexp:/a/g,url:new URL('http://a.b'),weakmap:new WeakMap(),sparse:[1,,3],nested:{d:new Date(5)},
 urlsp:new URLSearchParams('a=1'),
};
(async()=>{
 for(const [k,v] of Object.entries(cases)){
  const errs=[];
  try{
   const stream=S.renderToPipeableStream({v},{},{onError(e){errs.push(String(e&&e.message||e).slice(0,100))}});
   const {PassThrough}=require('stream');const pt=new PassThrough();stream.pipe(pt);
   let out='';for await(const c of pt)out+=c;
   console.log(k,'=>',JSON.stringify(out.slice(0,200)),errs.length?'ERR:'+errs.join('|'):'');
  }catch(e){console.log(k,'THROW',e.message.slice(0,150))}
 }
})();
