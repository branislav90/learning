// @vitest-environment jsdom
import { test } from 'vitest';
import React, { useState, act } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('mutation closure', async () => {
  const seen: string[] = [];
  let release!: () => void; const gate = new Promise<void>(r => (release = r));
  let setCart!: (n: number) => void; let mutate!: any;
  function C() {
    const [cart, sc] = useState(1); setCart = sc;
    const m = useMutation({ mutationFn: async () => { await gate; return 1; }, onSuccess: () => { seen.push('hook-level cart=' + cart); } });
    mutate = (o?: any) => m.mutate(undefined, o);
    return null;
  }
  const host = document.createElement('div'); const root = createRoot(host);
  await act(async () => root.render(<QueryClientProvider client={new QueryClient()}><C /></QueryClientProvider>));
  await act(async () => { mutate({ onSuccess: () => seen.push('call-level (latest render? unknown)') }); });
  await act(async () => setCart(2));
  await act(async () => { release(); await new Promise(r => setTimeout(r, 20)); });
  console.log('TQ', seen);
});
