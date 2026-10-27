import { QueryClient, QueryClientProvider, QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Suspense } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
class HttpError extends Error { constructor(public status:number){super('HTTP '+status)} }
test('boundary + query reset', async () => {
  vi.spyOn(console,'error').mockImplementation(()=>{});
  const qc=new QueryClient({defaultOptions:{queries:{retry:false}}}); let calls=0; let fail=true;
  function ProductError({ error, resetErrorBoundary }: FallbackProps) { return <div role="alert"><p>fail {(error as any).message}</p><button onClick={resetErrorBoundary}>Try again</button></div>; }
  function Product({ id }: { id: string }) { const { data } = useSuspenseQuery({ queryKey: ['product', id], queryFn: async () => { calls++; await sleep(5); if (fail) throw new HttpError(503); return { name: 'N'+id }; } }); return <h1>{data.name}</h1>; }
  function Panel({ id }: { id: string }) { return <QueryErrorResetBoundary>{({ reset }) => (<ErrorBoundary resetKeys={[id]} FallbackComponent={ProductError}><Suspense fallback={<p>Loading…</p>}><Product id={id} /></Suspense></ErrorBoundary>)}</QueryErrorResetBoundary>; }
  const { rerender } = render(<QueryClientProvider client={qc}><Panel id="1" /></QueryClientProvider>);
  await act(async()=>{await sleep(40)}); console.log('1:', document.body.textContent, 'calls', calls);
  fail=false; await act(async()=>{fireEvent.click(screen.getByText('Try again'))}); await act(async()=>{await sleep(40)});
  console.log('2 after Try again:', document.body.textContent, 'calls', calls);
  fail=true; rerender(<QueryClientProvider client={qc}><Panel id="2" /></QueryClientProvider>); await act(async()=>{await sleep(40)});
  console.log('3 id=2 fails:', document.body.textContent, 'calls', calls); fail=false;
  rerender(<QueryClientProvider client={qc}><Panel id="3" /></QueryClientProvider>); await act(async()=>{await sleep(40)});
  console.log('4 resetKeys id=3 recovers:', document.body.textContent, 'calls', calls);
});
