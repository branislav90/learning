import { StrictMode, useEffect, useState } from 'react';
import { render, screen, act } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const lat: Record<string, number> = { r: 400, re: 600, rea: 100 };
let reqs: string[] = [];
function fakeFetch(q: string, signal?: AbortSignal) {
  reqs.push(q);
  return new Promise<string>((res, rej) => {
    const t = setTimeout(() => res(q), lat[q]);
    signal?.addEventListener('abort', () => { clearTimeout(t); rej(signal.reason); });
  });
}
function Bad({ q }: { q: string }) { const [r, set] = useState(''); useEffect(() => { fakeFetch(q).then(set); }, [q]); return <p>{r}</p>; }
function Ignore({ q, strict }: { q: string; strict?: boolean }) { const [r, set] = useState(''); useEffect(() => { let ignore = false; fakeFetch(q).then(d => { if (!ignore) set(d); }); return () => { ignore = true; }; }, [q]); return <p>{r}</p>; }
function Abort({ q }: { q: string }) { const [r, set] = useState(''); useEffect(() => { const c = new AbortController(); fakeFetch(q, c.signal).then(set, e => { if (!c.signal.aborted) throw e; }); return () => c.abort(); }, [q]); return <p>{r}</p>; }
function Ref({ q }: { q: string }) { const [r, set] = useState(''); useEffect(() => { fakeFetch(q).then(d => set(d)); }, [q]); return <p>{r}</p>; }
vi.useFakeTimers();
for (const [name, C] of [['bad', Bad], ['ignore', Ignore], ['abort', Abort]] as const) {
  test(name, async () => {
    reqs = [];
    const { rerender } = render(<C q="r" />);
    await act(async () => { vi.advanceTimersByTime(100); }); rerender(<C q="re" />);
    await act(async () => { vi.advanceTimersByTime(100); }); rerender(<C q="rea" />);
    const seq: string[] = [];
    for (const t of [100, 100, 300]) { await act(async () => { vi.advanceTimersByTime(t); }); seq.push(document.querySelector('p')!.textContent!); }
    console.log(name, 'display at t=300,400,700:', seq.join(' -> '));
  });
}
test('strict mode request count', async () => {
  reqs = []; let sets = 0;
  function U() { const [u, s] = useState(''); useEffect(() => { let ignore = false; fakeFetch('rea').then(d => { if (!ignore) { sets++; s(d); } }); return () => { ignore = true; }; }, []); return <p>{u}</p>; }
  render(<StrictMode><U /></StrictMode>);
  await act(async () => { vi.advanceTimersByTime(1000); });
  console.log('strict: requests', reqs.length, 'setState calls', sets);
});
