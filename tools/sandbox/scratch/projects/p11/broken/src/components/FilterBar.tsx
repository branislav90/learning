import { useApp } from '../AppContext';
import type { Priority, SortKey, Status } from '../types';

export function FilterBar() {
  const {
    query, setQuery, status, setStatus, priority, setPriority,
    sortKey, setSortKey, liveEnabled, setLiveEnabled,
  } = useApp();

  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search title or requester"
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as Status | 'all')}>
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
      <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority | 'all')}>
        <option value="all">All priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select aria-label="Sort" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
        <option value="createdAt">Newest</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
      <label>
        <input type="checkbox" checked={liveEnabled} onChange={(e) => setLiveEnabled(e.target.checked)} /> Live feed
      </label>
    </div>
  );
}
