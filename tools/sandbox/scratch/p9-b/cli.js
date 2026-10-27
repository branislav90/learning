const S=require('react-server-dom-webpack/server.node');const {PassThrough,Readable}=require('stream');
(async()=>{
 const v={d:new Date(0),m:new Map([['a',1]]),s:new Set([1]),big:5n,nan:NaN,u:undefined,u8:new Uint8Array([1,2]),it:(function*(){yield 1})(),circ:null};
 v.circ=v;
 const s=S.renderToPipeableStream(v,{});const pt=new PassThrough();s.pipe(pt);
 // client via node build
 const C=require('react-server-dom-webpack/client.node');
 const root=await C.createFromNodeStream(pt,{moduleMap:{},moduleLoading:{prefix:'/'}});
 console.log('Date',root.d instanceof Date,'Map',root.m instanceof Map,'Set',root.s instanceof Set,typeof root.big,root.nan,root.u,root.u8.constructor.name,root.circ===root, root.it&&Object.prototype.toString.call(root.it), [...root.it]);
 // reply direction
 const CB=require('react-server-dom-webpack/client.edge');
 class K{constructor(){this.a=1}}
 for(const [k,a] of Object.entries({date:new Date(0),map:new Map([[1,2]]),set:new Set([1]),bigint:3n,nan:NaN,undef:undefined,cls:new K(),fn:()=>1,np:Object.assign(Object.create(null),{x:1}),fd:(()=>{const f=new FormData();f.append('a','b');return f})(),sym:Symbol.for('q'),blob:new Blob(['x']),err:new Error('e')})){
  try{const body=await CB.encodeReply([a]);
   const out=await S.decodeReply(body,{});
   console.log('reply',k,'->',out[0] instanceof Date?'Date':out[0] instanceof Map?'Map':out[0] instanceof Set?'Set':out[0] instanceof FormData?'FormData':out[0]===undefined?'undefined':out[0]&&out[0].constructor&&out[0].constructor.name||typeof out[0], typeof out[0]==='number'||typeof out[0]==='bigint'?String(out[0]):'')
  }catch(e){console.log('reply',k,'THROW',e.message.split('\n')[0].slice(0,120))}
 }
})().catch(e=>console.log('FAIL',e));
