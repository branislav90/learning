import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useSetView, useView } from '../state/view';
import type { Priority, SortKey, Status } from '../types';

export function FilterBar() {
  const { status, priority, sortKey, liveEnabled } = useView();
  const setView = useSetView();

  const [text, setText] = useState('');                       // keystroke-rate state stays local
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);     // no timer outlives the component

  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setView({ query: value.trim() }), 250);
  }

  return (
    <div className="filters">
      <input type="search" placeholder="Search title or requester" aria-label="Search" value={text} onChange={onSearchChange} />
      <select aria-label="Status" value={status} onChange={(e) => setView({ status: e.target.value as Status | 'all' })}>
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
      <select aria-label="Priority" value={priority} onChange={(e) => setView({ priority: e.target.value as Priority | 'all' })}>
        <option value="all">All priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select aria-label="Sort" value={sortKey} onChange={(e) => setView({ sortKey: e.target.value as SortKey })}>
        <option value="createdAt">Newest</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
      <label>
        <input type="checkbox" checked={liveEnabled} onChange={(e) => setView({ liveEnabled: e.target.checked })} /> Live feed
      </label>
    </div>
  );
}
