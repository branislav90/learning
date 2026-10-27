import { RealtimeClient } from './rt/realtime';
class FakeWS { static OPEN=1; static instances:FakeWS[]=[]; readyState=0; sent:string[]=[]; onopen:any; onclose:any; onmessage:any; closedWith:any; constructor(public url:string){FakeWS.instances.push(this)} send(s:string){this.sent.push(s)} close(c?:number){this.closedWith=c??'none'; this.readyState=3; setTimeout(()=>this.onclose?.({code:c??1005}),0)} open(){this.readyState=1;this.onopen()} }
(globalThis as any).WebSocket=FakeWS; (globalThis as any).window=globalThis;
test('heartbeat bug?', async () => {
  vi.useFakeTimers();
  const c = new RealtimeClient({ url: async()=>'ws://x', onReconnect:()=>{}, heartbeatMs: 20_000, heartbeatTimeoutMs: 10_000 });
  c.subscribe('t', ()=>{}); await vi.advanceTimersByTimeAsync(0); const ws=FakeWS.instances[0]; ws.open();
  // healthy server: answers every ping with pong immediately
  const origSend=ws.send.bind(ws); ws.send=(s:string)=>{ origSend(s); if(JSON.parse(s).type==='ping') setTimeout(()=>ws.onmessage({data:JSON.stringify({type:'pong'})}),50) };
  await vi.advanceTimersByTimeAsync(20_100);   // first ping + pong
  console.log('t=20.1s sockets', FakeWS.instances.length, 'closedWith', ws.closedWith, 'status', c.getStatus());
  await vi.advanceTimersByTimeAsync(10_500);   // 10s after the pong
  console.log('t=30.6s healthy-server socket closed by client?', ws.closedWith, 'status', c.getStatus());
  c.close(); vi.useRealTimers();
});
test('fixed: healthy stays open, silent dies', async () => {
  vi.useFakeTimers(); FakeWS.instances.length=0;
  const c = new RealtimeClient({ url: async()=>'ws://x', onReconnect:()=>{}, heartbeatMs: 20_000, heartbeatTimeoutMs: 10_000 });
  c.subscribe('t', ()=>{}); await vi.advanceTimersByTimeAsync(0); const ws=FakeWS.instances[0]; ws.open();
  const origSend=ws.send.bind(ws); let answer=true; ws.send=(s:string)=>{ origSend(s); if(answer&&JSON.parse(s).type==='ping') setTimeout(()=>ws.onmessage({data:JSON.stringify({type:'pong'})}),50) };
  await vi.advanceTimersByTimeAsync(100_000);
  console.log('FIXED healthy after 100s: closedWith', ws.closedWith, c.getStatus());
  answer=false; await vi.advanceTimersByTimeAsync(31_000);
  console.log('FIXED silent server: closedWith', ws.closedWith, c.getStatus());
  c.close(); vi.useRealTimers();
});
