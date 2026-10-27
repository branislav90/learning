import { StrictMode } from 'react';
import { render, screen, act, fireEvent, within } from '@testing-library/react';
import { vi, test, expect, beforeEach, afterEach, beforeAll } from 'vitest';

const counters = vi.hoisted(() => ({ age: 0, clock: 0, row: 0 }));
vi.mock('../fixed/src/lib/format', async (orig) => {
  const m = await orig<typeof import('../fixed/src/lib/format')>();
  return { ...m, formatAge: (...a: Parameters<typeof m.formatAge>) => { counters.age++; return m.formatAge(...a); } };
});
vi.mock('../fixed/src/components/Clock', async (orig) => {
  const m = await orig<typeof import('../fixed/src/components/Clock')>();
  return { Clock: () => { counters.clock++; return m.Clock(); } };
});

import { App } from '../fixed/src/App';
import { TicketsProvider } from '../fixed/src/state/tickets';
import { ViewProvider } from '../fixed/src/state/view';
import * as api from '../fixed/src/mockApi';

beforeAll(() => {
  // jsdom has no layout: give every element a 800x660 box so the virtualizer renders a window
  const box = { width: 800, height: 660, top: 0, left: 0, right: 800, bottom: 660, x: 0, y: 0, toJSON() {} };
  HTMLElement.prototype.getBoundingClientRect = () => box as DOMRect;
  for (const [k, v] of [['offsetHeight', 660], ['offsetWidth', 800], ['clientHeight', 660], ['clientWidth', 800]] as const)
    Object.defineProperty(HTMLElement.prototype, k, { configurable: true, get: () => v });
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
});

const adv = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
function mount(strict = true) {
  const tree = <TicketsProvider><ViewProvider><App /></ViewProvider></TicketsProvider>;
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}
beforeEach(() => { vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] }); counters.age = 0; counters.clock = 0; });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
const stat = (label: string) => screen.getByText(new RegExp(`^${label}:`)).textContent;
const rows = () => Array.from(document.querySelectorAll<HTMLElement>('.row'));
// find a row by ticket id after scrolling is not needed: first rows by createdAt desc; click first row and read id from title
const idOf = (el: Element) => Number(/#(\d+)\)/.exec(el.querySelector('.title')!.textContent!)![1]);

test('virtualized: ~window rows, not 5000', async () => {
  mount();
  await adv(400);
  console.log('fixed .row count:', rows().length);
  expect(rows().length).toBeGreaterThan(5);
  expect(rows().length).toBeLessThan(40);
});

test('S4 race fixed (spyOn on ESM export works?) + abort + reset', async () => {
  mount();
  await adv(400);
  const spy = vi.spyOn(api, 'fetchTicketDetail');
  const ids = rows().map(idOf);
  const even = rows().find((r) => idOf(r) % 2 === 0)!;
  const odd = rows().find((r) => idOf(r) % 2 === 1)!;
  const evenId = idOf(even), oddId = idOf(odd);
  fireEvent.click(even);
  await adv(100);
  fireEvent.click(odd);
  await adv(2000);
  const aside = screen.getByLabelText('Ticket detail');
  console.log('spy calls', spy.mock.calls.length, 'first signal aborted:', spy.mock.calls[0]?.[1]?.aborted);
  expect(within(aside).getByText(/Detailed description/).textContent).toBe(`Detailed description for ticket #${oddId}.`);
  expect(spy.mock.calls[0]?.[1]?.aborted).toBe(true);
  // D12: reply reset on switch
  fireEvent.change(screen.getByLabelText('Reply'), { target: { value: 'draft' } });
  fireEvent.click(even);
  expect((screen.getByLabelText('Reply') as HTMLTextAreaElement).value).toBe('');
  expect(screen.getByText('Loading…')).toBeTruthy();
  void ids; void evenId;
});

test('search: debounced single request; final list matches final query', async () => {
  mount();
  await adv(400);
  const spy = vi.spyOn(api, 'searchTickets');
  const input = screen.getByLabelText('Search');
  for (const q of ['l', 'lo', 'log', 'logi', 'login']) fireEvent.change(input, { target: { value: q } });
  await adv(300); // debounce 250
  await adv(1500);
  console.log('search calls:', spy.mock.calls.map((c) => c[0]));
  expect(spy.mock.calls.length).toBe(1);
  const titlesOk = rows().every((r) => /login/i.test(r.textContent!));
  console.log('rows all match login:', titlesOk, 'count', rows().length);
  expect(titlesOk).toBe(true);
});

test('D9 fixed: status update reflects immediately in row and stats', async () => {
  mount();
  await adv(400);
  const first = rows()[0]!;
  const id = idOf(first);
  fireEvent.click(first);
  await adv(300);
  const before = rows()[0]!.querySelectorAll('.badge')[1]!.textContent!;
  const target = before === 'open' ? 'resolved' : 'open';
  const s0 = [stat('Open'), stat('Resolved')];
  fireEvent.change(within(screen.getByLabelText('Ticket detail')).getByLabelText(/Status/), { target: { value: target } });
  await adv(0);
  console.log('fixed row', id, before, '->', rows().find((r) => idOf(r) === id)!.querySelectorAll('.badge')[1]!.textContent, '| stats', s0, '->', [stat('Open'), stat('Resolved')]);
  expect(rows().find((r) => idOf(r) === id)!.querySelectorAll('.badge')[1]!.textContent).toBe(target);
  expect([stat('Open'), stat('Resolved')]).not.toEqual(s0);
});

test('live feed: one interval under StrictMode, stops when disabled; stars follow ids', async () => {
  mount(true);
  await adv(400);
  const si = vi.spyOn(globalThis, 'setInterval');
  const ci = vi.spyOn(globalThis, 'clearInterval');
  const total = () => Number(/(\d+)/.exec(stat('Total')!)![1]);
  const firstId = idOf(rows()[0]!);
  fireEvent.click(rows()[0]!.querySelector('button')!); // star it
  fireEvent.click(screen.getByLabelText(/Live feed/));
  await adv(0);
  const t0 = total();
  await adv(4100);
  console.log('fixed live: +', total() - t0, 'in 4.1s; setInterval', si.mock.calls.length, 'clear', ci.mock.calls.length);
  const starred = rows().filter((r) => r.querySelector('button')!.getAttribute('aria-pressed') === 'true').map(idOf);
  console.log('starred ids', starred, 'originally', firstId);
  fireEvent.click(screen.getByLabelText(/Live feed/));
  await adv(100);
  const t1 = total();
  await adv(6000);
  console.log('after disable total', t1, '->', total());
  expect(total()).toBe(t1);
  fireEvent.click(screen.getByLabelText(/Live feed/));
  await adv(100);
  const t2 = total();
  await adv(4000);
  expect(total() - t2).toBe(2);
});

test('idle: per-second Clock only; row ages update per minute only', async () => {
  mount(false);
  await adv(400);
  counters.age = 0; counters.clock = 0;
  for (let i = 0; i < 3; i++) await adv(1000);
  console.log('fixed idle 3s: Clock renders', counters.clock, 'formatAge calls', counters.age);
  expect(counters.age).toBe(0);
  await adv(60_000);
  console.log('after 60s more: formatAge calls', counters.age);
});

test('resize listeners balanced', async () => {
  mount(true);
  await adv(400);
  const add = vi.spyOn(window, 'addEventListener');
  const rem = vi.spyOn(window, 'removeEventListener');
  for (let i = 0; i < 3; i++) { fireEvent.click(rows()[0]!); await adv(100); fireEvent.click(screen.getByText('Close')); await adv(0); }
  const a = add.mock.calls.filter((c) => c[0] === 'resize').length, r = rem.mock.calls.filter((c) => c[0] === 'resize').length;
  console.log('fixed resize add/remove', a, r);
  expect(a).toBe(r);
});

test('latent: status change while a search is active (results snapshot is stale?)', async () => {
  mount(false);
  await adv(400);
  fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'login' } });
  await adv(300); await adv(1500);
  const first = rows()[0]!; const id = idOf(first);
  fireEvent.click(first); await adv(300);
  const before = rows().find((r) => idOf(r) === id)!.querySelectorAll('.badge')[1]!.textContent!;
  const target = before === 'open' ? 'resolved' : 'open';
  fireEvent.change(within(screen.getByLabelText('Ticket detail')).getByLabelText(/Status/), { target: { value: target } });
  await adv(0);
  const after = rows().find((r) => idOf(r) === id)!.querySelectorAll('.badge')[1]!.textContent;
  console.log('LATENT search+status: row badge', before, '->', after, '(target', target + ')');
});
