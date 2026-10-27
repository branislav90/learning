import { useCallback, useSyncExternalStore, useEffect, useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const listeners = new Set<() => void>(); const notify = () => listeners.forEach((l) => l());
function subscribe(l: () => void) { listeners.add(l); window.addEventListener('popstate', l); return () => { listeners.delete(l); window.removeEventListener('popstate', l); }; }
const getSearch = () => window.location.search; const getServerSearch = () => '';
function useSearchParam(name: string, fallback: string) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const value = new URLSearchParams(search).get(name) ?? fallback;
  const setValue = useCallback((next: string, { replace = true } = {}) => {
    const sp = new URLSearchParams(window.location.search); if (next === fallback) sp.delete(name); else sp.set(name, next);
    const qs = sp.toString(); const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url); notify();
  }, [name, fallback]);
  return [value, setValue] as const;
}
test('predict A/B', async () => {
  const log: string[] = [];
  function A() { const [v, set] = useSearchParam('q', ''); log.push('A:' + v); return <button onClick={() => set('x')}>setx</button>; }
  function B() { const [v] = useSearchParam('q', ''); log.push('B:' + v); return <p>{v}</p>; }
  render(<><A /><B /></>); log.length = 0; await act(async () => { fireEvent.click(screen.getByText('setx')); });
  console.log('A/B after set:', log.join(','), '| url', location.search);
  let popped = 0; window.addEventListener('popstate', () => popped++); history.pushState(null, '', '/?q=z'); history.replaceState(null, '', '/?q=y'); console.log('popstate after push/replace:', popped);
});
test('searchbox effects', async () => {
  vi.useFakeTimers(); history.replaceState(null, '', '/');
  const commits: string[] = [];
  function SearchBox() {
    const [q, setQ] = useSearchParam('q', ''); const [text, setText] = useState(q);
    useEffect(() => { setText(q); }, [q]);
    useEffect(() => { if (text === q) return; const id = setTimeout(() => { commits.push(text); setQ(text); }, 300); return () => clearTimeout(id); }, [text, q, setQ]);
    return <input aria-label="s" value={text} onChange={(e) => setText(e.target.value)} />;
  }
  render(<SearchBox />); const inp = screen.getByLabelText('s') as HTMLInputElement;
  fireEvent.change(inp, { target: { value: 'ab' } }); await act(async () => { vi.advanceTimersByTime(100); });
  await act(async () => { history.replaceState(null, '', '/?q=x'); notify(); });   // external change (e.g. Back) before the debounce fires
  await act(async () => { vi.advanceTimersByTime(1000); });
  console.log('after external change: input=', inp.value, 'commits', commits, 'url', location.search);
  vi.useRealTimers();
});
