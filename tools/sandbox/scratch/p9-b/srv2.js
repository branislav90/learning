const S=require('react-server-dom-webpack/server.node');const {PassThrough}=require('stream');
const np=Object.create(null);np.x=1;
const cases={np,regexp:/a/g,err:new Error('boom',{cause:'c'}),Sym:Symbol.iterator,nestedClsInArr:[new (class A{})],blobinFn:{f(){}}, date:new Date(0)};
(async()=>{for(const [k,v] of Object.entries(cases)){const errs=[];const s=S.renderToPipeableStream({v},{},{onError(e){errs.push(e.message.split('\n')[0])}});const pt=new PassThrough();s.pipe(pt);let o='';for await(const c of pt)o+=c;console.log(k,JSON.stringify(o.replace(/^:N\S+\n/,'').slice(0,260)),errs)}})();
