import { StrictMode, Profiler } from 'react';
import { render, screen, act, fireEvent, within } from '@testing-library/react';
import { vi, test, expect, beforeEach, afterEach } from 'vitest';

const counters = vi.hoisted(() => ({ cmp: 0, age: 0, header: 0 }));
vi.mock('../broken/src/components/Header', async (orig) => {
  const m = await orig<typeof import('../broken/src/components/Header')>();
  return { Header: () => { counters.header++; return m.Header(); } };
});
vi.mock('../broken/src/format', async (orig) => {
  const m = await orig<typeof import('../broken/src/format')>();
  return {
    ...m,
    formatAge: (...a: Parameters<typeof m.formatAge>) => { counters.age++; return m.formatAge(...a); },
    compareTickets: (k: Parameters<typeof m.compareTickets>[0]) => {
      const f = m.compareTickets(k);
      return (a: any, b: any) => { counters.cmp++; return f(a, b); };
    },
  };
});

import { App } from '../broken/src/App';
import { AppProvider } from '../broken/src/AppContext';
import * as api from '../broken/src/mockApi';

const adv = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
let commits = 0;
function mount(strict = false) {
  const tree = (
    <AppProvider>
      <Profiler id="x" onRender={() => { commits++; }}><App /></Profiler>
    </AppProvider>
  );
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}
beforeEach(() => { vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] }); commits = 0; counters.cmp = 0; counters.age = 0; });
afterEach(() => { vi.useRealTimers(); });
const rowFor = (id: number) => screen.getAllByText(new RegExp(`\\(#${id}\\)$`)).map((e) => e.closest('li.row')).find(Boolean)! as HTMLElement;
const stat = (label: string) => screen.getByText(new RegExp(`^${label}:`)).textContent;

test('D6/D2: 5000 rows in DOM; hidden Reports mounted', async () => {
  const { container } = mount();
  await adv(400);
  expect(container.querySelectorAll('.row').length).toBe(5000);
  const rep = container.querySelector('section[aria-label="Reports"]')!;
  expect(rep).toBeTruthy();
  expect(rep.closest('[hidden]')).toBeTruthy();
  console.log('D6 rows', container.querySelectorAll('.row').length, 'Reports mounted while hidden: true');
});

test('D2: idle commits each second re-render all rows (formatAge calls/sec)', async () => {
  mount();
  await adv(400);
  counters.header = 0; counters.age = 0;
  for (let i = 0; i < 3; i++) await adv(1000);
  console.log('D2 idle Header renders in 3s:', counters.header, 'formatAge calls:', counters.age);
  expect(counters.header).toBeGreaterThanOrEqual(3);
  expect(counters.age).toBeGreaterThanOrEqual(3 * 5000);
});

test('D5: search race - final list is for "l" while input says "login"', async () => {
  const { container } = mount();
  await adv(400);
  const input = screen.getByLabelText('Search') as HTMLInputElement;
  for (const q of ['l', 'lo', 'log', 'logi', 'login']) fireEvent.change(input, { target: { value: q } });
  await adv(2000);
  const expectedLogin = await (async () => { const p = api.searchTickets('login'); await adv(300); return p; })();
  const expectedL = await (async () => { const p = api.searchTickets('l'); await adv(1000); return p; })();
  const shown = container.querySelectorAll('.row').length;
  console.log('D5 search input:', input.value, 'rows shown:', shown, 'expected for login:', expectedLogin.length, 'for l:', expectedL.length);
  expect(shown).toBe(expectedL.length);
  expect(shown).not.toBe(expectedLogin.length);
});

test('D5/S4: even then odd click -> heading odd, body even', async () => {
  mount();
  await adv(400);
  fireEvent.click(rowFor(2));
  await adv(100);
  fireEvent.click(rowFor(1));
  await adv(2000);
  const aside = screen.getByLabelText('Ticket detail');
  console.log('S4 heading:', within(aside).getByRole('heading').textContent, '| body:', aside.querySelector('p')?.textContent);
  expect(within(aside).getByRole('heading').textContent).toMatch(/#1\)/);
  expect(within(aside).getByText(/Detailed description/).textContent).toBe('Detailed description for ticket #2.');
});

test('D12: stale content + reply draft survive selection change', async () => {
  mount();
  await adv(400);
  fireEvent.click(rowFor(1));
  await adv(300);
  fireEvent.change(screen.getByLabelText('Reply'), { target: { value: 'hello A' } });
  fireEvent.click(rowFor(3));
  const aside = screen.getByLabelText('Ticket detail');
  console.log('D12 right after switch: body:', within(aside).getByText(/Detailed description/).textContent, '| reply:', (screen.getByLabelText('Reply') as HTMLTextAreaElement).value, '| loading shown:', !!within(aside).queryByText('Loading…'));
  expect((screen.getByLabelText('Reply') as HTMLTextAreaElement).value).toBe('hello A');
  expect(within(aside).getByText(/Detailed description/).textContent).toContain('#1.');
});

test('D9/D4: mutation shows late; stats never update', async () => {
  mount();
  await adv(400);
  fireEvent.click(rowFor(1));
  await adv(300);
  const row = rowFor(1);
  const before = row.querySelectorAll('.badge')[1]!.textContent!;
  const target = before === 'open' ? 'resolved' : 'open';
  const statsBefore = [stat('Open'), stat('Resolved')];
  const sel = within(screen.getByLabelText('Ticket detail')).getByLabelText(/Status/) as HTMLSelectElement;
  fireEvent.change(sel, { target: { value: target } });
  await adv(0);
  const immediate = rowFor(1).querySelectorAll('.badge')[1]!.textContent;
  console.log('D9 before', before, 'target', target, 'row badge immediately:', immediate, 'select value immediately:', (within(screen.getByLabelText('Ticket detail')).getByLabelText(/Status/) as HTMLSelectElement).value);
  expect(immediate).toBe(before);
  await adv(1000);
  const later = rowFor(1).querySelectorAll('.badge')[1]!.textContent;
  console.log('D9 after 1s tick: row badge', later, '| stats before', statsBefore, 'after', [stat('Open'), stat('Resolved')]);
  expect(later).toBe(target);
  await adv(5000);
  expect([stat('Open'), stat('Resolved')]).toEqual(statsBefore);
});

test('D3/D7: index keys move star; interval survives disable; strict mode interval count', async () => {
  const { container } = mount(true);
  await adv(400);
  const firstTitle = () => container.querySelector('.row .title')!.textContent;
  fireEvent.click(container.querySelector('.row button')!);
  const starredTitle = firstTitle();
  const si = vi.spyOn(globalThis, 'setInterval');
  const ci = vi.spyOn(globalThis, 'clearInterval');
  fireEvent.click(screen.getByLabelText(/Live feed/));
  await adv(0);
  console.log('D7 strict mode: setInterval calls on a single checkbox tick:', si.mock.calls.length, 'clear:', ci.mock.calls.length);
  await adv(2100);
  const newFirst = firstTitle();
  const firstBtn = container.querySelector('.row button')!;
  console.log('D3 starred was', starredTitle, '| row0 now', newFirst, '| row0 starred:', firstBtn.getAttribute('aria-pressed'));
  expect(newFirst).not.toBe(starredTitle);
  expect(firstBtn.getAttribute('aria-pressed')).toBe('true');
  // untick -> keeps arriving
  const total = () => Number(/(\d+)/.exec(stat('Total')!)![1]);
  fireEvent.click(screen.getByLabelText(/Live feed/));
  await adv(100);
  const t0 = total();
  await adv(6000);
  console.log('D7 after unticking, Total grew', t0, '->', total());
  expect(total()).toBeGreaterThan(t0);
  // tick again -> doubled rate
  fireEvent.click(screen.getByLabelText(/Live feed/));
  await adv(100);
  const t1 = total();
  await adv(4000);
  console.log('D7 after re-tick: +', total() - t1, 'in 4s (single interval would be +2)');
}, 180000);

test('D7: resize listeners leak per open (non-strict and strict)', async () => {
  for (const strict of [false, true]) {
    const { unmount } = mount(strict);
    await adv(400);
    const add = vi.spyOn(window, 'addEventListener');
    const rem = vi.spyOn(window, 'removeEventListener');
    for (let i = 0; i < 3; i++) {
      fireEvent.click(rowFor(1));
      await adv(100);
      fireEvent.click(screen.getByText('Close'));
      await adv(0);
    }
    const adds = add.mock.calls.filter((c) => c[0] === 'resize').length;
    const rems = rem.mock.calls.filter((c) => c[0] === 'resize').length;
    console.log(`D7 resize strict=${strict}: add ${adds} remove ${rems} over 3 opens`);
    add.mockRestore(); rem.mockRestore();
    unmount();
  }
});

test('D10: comparator calls on sort change; D4 two commits per filter change', async () => {
  mount();
  await adv(400);
  counters.cmp = 0;
  fireEvent.change(screen.getByLabelText('Sort'), { target: { value: 'priority' } });
  await adv(0);
  counters.cmp = 0;
  fireEvent.change(screen.getByLabelText('Sort'), { target: { value: 'createdAt' } });
  await adv(0);
  console.log('D10 comparator calls for Newest sort (moment parse x2 each):', counters.cmp);
  commits = 0;
  counters.header = 0;
  fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'urgent' } });
  await adv(0);
  console.log('D4 provider-level renders (Header renders) for one priority-filter change:', counters.header);
});
