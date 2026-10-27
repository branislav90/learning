import { useState } from 'react';
import { useApp } from './AppContext';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { FilterBar } from './components/FilterBar';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { Reports } from './components/Reports';

export function App() {
  const [tab, setTab] = useState<'tickets' | 'reports'>('tickets');
  const { selectedId } = useApp();

  return (
    <div className="app">
      <Header />
      <div className="tabs" role="group" aria-label="Views">
        <button aria-pressed={tab === 'tickets'} onClick={() => setTab('tickets')}>Tickets</button>
        <button aria-pressed={tab === 'reports'} onClick={() => setTab('reports')}>Reports</button>
      </div>
      <Stats />
      <div hidden={tab !== 'tickets'}>
        <FilterBar />
        <div className="split">
          <TicketList />
          {selectedId != null && <TicketDetail />}
        </div>
      </div>
      <div hidden={tab !== 'reports'}>
        <Reports />
      </div>
    </div>
  );
}
