import { lazy, Suspense, useState } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { FilterBar } from './components/FilterBar';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { LiveFeedController } from './components/LiveFeedController';

const Reports = lazy(() => import('./components/Reports')); // separate chunk, fetched on first visit

export function App() {
  const [tab, setTab] = useState<'tickets' | 'reports'>('tickets'); // local UI state stays local

  return (
    <div className="app">
      <LiveFeedController />
      <Header />
      <div className="tabs" role="group" aria-label="Views">
        <button aria-pressed={tab === 'tickets'} onClick={() => setTab('tickets')}>Tickets</button>
        <button aria-pressed={tab === 'reports'} onClick={() => setTab('reports')}>Reports</button>
      </div>
      <Stats />
      {tab === 'tickets' ? (
        <>
          <FilterBar />
          <div className="split">
            <TicketList />
            <TicketDetail />
          </div>
        </>
      ) : (
        <Suspense fallback={<p>Loading reports…</p>}>
          <Reports />
        </Suspense>
      )}
    </div>
  );
}
