function createLatest() {
  let controller = null;
  return async function run(fn) {
    controller?.abort(); controller = new AbortController(); const mine = controller;
    try { const value = await fn(mine.signal); return mine.signal.aborted ? undefined : value; }
    catch (e) { if (mine.signal.aborted) return undefined; throw e; }
  };
}
const run = createLatest(); const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const slow = run(async (s)=>{await sleep(50); return 'slow'}); const fast = run(async (s)=>{await sleep(5); return 'fast'});
console.log(await slow, await fast);
const r2 = createLatest(); const a = r2((s)=>new Promise((res,rej)=>{s.addEventListener('abort',()=>rej(new DOMException('x','AbortError')))})); const b = r2(async()=> 'b'); console.log(await a, await b);
