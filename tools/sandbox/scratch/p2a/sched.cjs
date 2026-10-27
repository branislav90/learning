const S=require('scheduler');
console.log(Object.keys(S).join(','));
const log=[]; const busy=ms=>{const e=performance.now()+ms; while(performance.now()<e);};
let done=0;
const job=()=>{ while(done<6){ busy(2); done++; log.push('low:'+done); if(done===1) S.unstable_scheduleCallback(S.unstable_UserBlockingPriority,()=>{log.push('urgent')}); if(S.unstable_shouldYield()) return done<6?job:undefined; } };
S.unstable_scheduleCallback(S.unstable_LowPriority, job);
setTimeout(()=>console.log('REAL', log.join(' ')),100);
console.log(S.unstable_ImmediatePriority,S.unstable_UserBlockingPriority,S.unstable_NormalPriority,S.unstable_LowPriority,S.unstable_IdlePriority);
