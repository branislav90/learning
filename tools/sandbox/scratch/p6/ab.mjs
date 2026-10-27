import http from 'http';
const srv=http.createServer((q,s)=>setTimeout(()=>s.end('{"a":1}'),100)).listen(0);
await new Promise(r=>srv.once('listening',r)); const url='http://localhost:'+srv.address().port;
const c=new AbortController(); const p=fetch(url,{signal:c.signal}).catch(e=>e); c.abort();
let e=await p; console.log('default abort:', e.name, e instanceof DOMException, c.signal.reason===e);
const c2=new AbortController(); const p2=fetch(url,{signal:c2.signal}).catch(e=>e); c2.abort(new Error('custom'));
e=await p2; console.log('custom reason:', e.message);
e=await fetch(url,{signal:AbortSignal.timeout(20)}).catch(e=>e); console.log('timeout:', e.name, e.constructor.name);
const a=new AbortController(); const any=AbortSignal.any([a.signal,AbortSignal.timeout(500)]); a.abort(); console.log('any', any.aborted, any.reason.name);
try{ a.signal.throwIfAborted() }catch(x){console.log('throwIfAborted', x.name)}
// body read abort
const c3=new AbortController(); const res=await fetch(url,{signal:c3.signal}); c3.abort(); console.log('body read after abort:', await res.json().catch(e=>e.name));
// aborted before call
console.log('pre-aborted', await fetch(url,{signal:AbortSignal.abort()}).catch(e=>e.name));
srv.close();
