import { test, vi } from "vitest";
import { debounce, throttle } from "./deb";
test("b", () => {
  vi.useFakeTimers();
  const run=(mk:(f:any)=>any)=>{ const out:number[]=[]; const f=mk(()=>out.push(Date.now()-t0)); const t0=Date.now();
    for (const t of [0,100,200,600,650]) { vi.setSystemTime(t0+t); vi.advanceTimersByTime(0); } return out; };
  const sim=(mk:(f:any)=>any)=>{ vi.setSystemTime(0); const t0=0; const out:number[]=[]; const f=mk((a:number)=>out.push(Date.now()));
    let now=0; for (const t of [0,100,200,600,650]) { vi.advanceTimersByTime(t-now); now=t; f(t);} vi.advanceTimersByTime(2000); return out; };
  console.log("B1", sim(f=>debounce(f,300)));
  console.log("B2 throttle", sim(f=>throttle(f,300)));
  console.log("B2 lead+trail+maxWait300", sim(f=>debounce(f,300,{leading:true,maxWait:300})));
});
