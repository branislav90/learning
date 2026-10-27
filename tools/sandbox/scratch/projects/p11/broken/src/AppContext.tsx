import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchTickets, nextLiveTicket, searchTickets } from './mockApi';
import { compareTickets, computeStats } from './format';
import type { Priority, SortKey, Stats, Status, Ticket } from './types';

interface AppState {
  tickets: Ticket[];
  visible: Ticket[];
  stats: Stats;
  now: number;
  query: string;
  setQuery: (q: string) => void;
  status: Status | 'all';
  setStatus: (s: Status | 'all') => void;
  priority: Priority | 'all';
  setPriority: (p: Priority | 'all') => void;
  sortKey: SortKey;
  setSortKey: (k: SortKey) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  liveEnabled: boolean;
  setLiveEnabled: (on: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  updateStatus: (id: number, status: Status) => void;
}

const emptyStats: Stats = { total: 0, byStatus: {}, byPriority: {}, avgAgeDays: 0 };

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchResults, setSearchResults] = useState<Ticket[] | null>(null);
  const [visible, setVisible] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [now, setNow] = useState(Date.now());
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [liveEnabled, setLiveEnabled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // initial load
  useEffect(() => {
    fetchTickets().then(setTickets);
  }, []);

  // clock
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // server-side search
  useEffect(() => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    searchTickets(query).then(setSearchResults);
  }, [query]);

  // filtered + sorted list
  useEffect(() => {
    const source = searchResults ?? tickets;
    const next = source.filter(
      (t) => (status === 'all' || t.status === status) && (priority === 'all' || t.priority === priority),
    );
    next.sort(compareTickets(sortKey));
    setVisible(next);
  }, [tickets, searchResults, status, priority, sortKey]);

  // statistics
  useEffect(() => {
    setStats(computeStats(tickets));
  }, [tickets]);

  // live feed
  useEffect(() => {
    if (!liveEnabled) return;
    setInterval(() => {
      setTickets((prev) => [nextLiveTicket(), ...prev]);
    }, 2000);
  }, [liveEnabled]);

  // theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function updateStatus(id: number, newStatus: Status) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;
    ticket.status = newStatus;
    setTickets(tickets);
  }

  const value = {
    tickets, visible, stats, now,
    query, setQuery, status, setStatus, priority, setPriority, sortKey, setSortKey,
    selectedId, setSelectedId, liveEnabled, setLiveEnabled, theme, setTheme, updateStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
