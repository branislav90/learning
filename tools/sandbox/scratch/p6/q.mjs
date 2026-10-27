function createSerialQueue(){ let tail=Promise.resolve(); return function enqueue(task){ const run=tail.then(task,task); tail=run.catch(()=>undefined); return run; } }
const q=createSerialQueue(); const log=[]; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const mk=(n,ms,fail)=>()=>{log.push('start '+n);return sleep(ms).then(()=>{log.push('end '+n); if(fail) throw new Error('f'+n); return n})};
const r=await Promise.allSettled([q(mk('X',50,true)),q(mk('Y',5)),q(mk('Z',1))]);
console.log(log.join(' | ')); console.log(r.map(x=>x.status+':'+(x.value??x.reason.message)).join(', '));
