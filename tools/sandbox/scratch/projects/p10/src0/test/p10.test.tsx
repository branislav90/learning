import { render, screen, act } from '@testing-library/react';
import { vi, it, expect, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
import { VehicleStore, type VehicleLive } from '../packages/platform/src/realtime/store';
import { createApi } from '../packages/platform/src/api/client';
import * as E from '../packages/platform/src/api/errors';
import { shouldRetry } from '../packages/platform/src/api/retry';
import { canTransition } from '../packages/modules/work-orders/src/model/status-machine';
import { useAnnouncer } from '../packages/ui/src/live-region/LiveRegion';
import { createSocket } from '../packages/platform/src/realtime/socket';

const v = (id: string, seq: number): VehicleLive => ({ id, seq, lat: 0, lng: 0, status: 'idle', speedKph: 0, at: seq });

it('VehicleStore: batches per frame, drops stale, resync keeps newer buffered deltas', async () => {
  const s = new VehicleStore(); let keyCalls = 0, allCalls = 0;
  s.subscribeKey('a', () => keyCalls++); s.subscribeAll(() => allCalls++);
  s.push(v('a', 1)); s.push(v('a', 2)); s.push(v('a', 2)); s.push(v('b', 1));
  expect(keyCalls).toBe(0);
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => setTimeout(r, 30));
  console.log('after frame: keyCalls', keyCalls, 'allCalls', allCalls, 'a.seq', s.getVehicle('a')?.seq);
  s.push(v('a', 1)); await new Promise((r) => setTimeout(r, 30));
  expect(s.getVehicle('a')?.seq).toBe(2);
  const ids1 = s.getIds(), ids2 = s.getIds(); expect(ids1).toBe(ids2);
  s.push(v('a', 10));                       // buffered delta newer than snapshot
  s.resetFromSnapshot([v('a', 5), v('c', 1)]);
  await new Promise((r) => setTimeout(r, 30));
  console.log('after resync: a.seq', s.getVehicle('a')?.seq, 'has b', !!s.getVehicle('b'), 'has c', !!s.getVehicle('c'));
});

it('API client: timeout vs caller abort vs error mapping; AbortSignal.any available', async () => {
  console.log('AbortSignal.any/timeout:', typeof AbortSignal.any, typeof AbortSignal.timeout);
  const api = createApi({ baseUrl: 'http://x', getTenantId: () => 't', getAuthHeader: () => undefined, onUnauthorized: () => {}, onTelemetry: () => {} });
  const slow = vi.fn((_u: unknown, init: RequestInit) => new Promise((_, rej) => init.signal!.addEventListener('abort', () => rej(new DOMException('aborted', 'AbortError')))));
  vi.stubGlobal('fetch', slow);
  const err = await api('/p', { schema: z.any(), timeoutMs: 20 }).catch((e) => e);
  console.log('timeout ->', err.constructor.name, err.kind);
  const ac = new AbortController();
  const p = api('/p', { schema: z.any(), signal: ac.signal, timeoutMs: 5000 }).catch((e) => e);
  ac.abort(); const e2 = await p;
  console.log('caller abort ->', e2.constructor.name, e2 instanceof E.AppError);
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'x' }), { status: 409 })));
  const e3 = await api('/p', { schema: z.any() }).catch((e) => e);
  console.log('409 ->', e3.constructor.name);
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ wrong: 1 }), { status: 200 })));
  const e4 = await api('/p', { schema: z.object({ id: z.string() }) }).catch((e) => e);
  console.log('schema mismatch ->', e4.constructor.name);
  vi.unstubAllGlobals();
  expect(shouldRetry(0, new E.NetworkError('x'))).toBe(true); expect(shouldRetry(0, new E.ConflictError('x'))).toBe(false); expect(shouldRetry(3, new E.ServerError('x'))).toBe(false);
});

it('status machine', () => { expect(canTransition('done', 'open')).toBe(false); expect(canTransition('open', 'assigned')).toBe(true); });

it('announcer digests and rate limits', async () => {
  vi.useFakeTimers();
  let announce!: (m: string) => void;
  function C() { const a = useAnnouncer(2000); announce = a.announce; return a.region; }
  render(<C />);
  act(() => { announce('one'); announce('two'); announce('three'); });
  await act(async () => { await vi.advanceTimersByTimeAsync(2600); });
  console.log('region text:', screen.getByRole('status').textContent);
  vi.useRealTimers();
});

it('socket: reconnect backoff, cleanup', async () => {
  vi.useFakeTimers();
  const sockets: { close: () => void; onclose?: () => void; onopen?: () => void }[] = [];
  class FakeWS { onopen?: () => void; onclose?: () => void; onmessage?: (e: unknown) => void; onerror?: () => void; constructor(public url: string) { sockets.push(this); } close() { this.onclose?.(); } }
  vi.stubGlobal('WebSocket', FakeWS);
  const statuses: string[] = [];
  const s = createSocket({ url: () => 'ws://x', onMessage: () => {}, onStatus: (x) => statuses.push(x), resync: async () => {} });
  sockets[0]!.onclose!();                      // drop
  await vi.advanceTimersByTimeAsync(1000);
  console.log('sockets after first drop+1s:', sockets.length, 'statuses', statuses);
  s.close(); sockets[1]?.onclose?.(); await vi.advanceTimersByTimeAsync(60_000);
  console.log('sockets after close():', sockets.length);
  vi.useRealTimers(); vi.unstubAllGlobals();
});
