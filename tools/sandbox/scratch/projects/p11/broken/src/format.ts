import _ from 'lodash';
import moment from 'moment';
import type { Priority, SortKey, Stats, Ticket } from './types';

export function formatAge(iso: string, now: number): string {
  return moment(iso).from(now, true);
}

export function computeStats(tickets: Ticket[]): Stats {
  return {
    total: tickets.length,
    byStatus: _.countBy(tickets, 'status'),
    byPriority: _.countBy(tickets, 'priority'),
    avgAgeDays: _.meanBy(tickets, (t) => moment().diff(moment(t.createdAt), 'days', true)),
  };
}

export function ticketsPerDay(tickets: Ticket[]): { day: string; count: number }[] {
  const grouped = _.groupBy(tickets, (t) => moment(t.createdAt).format('YYYY-MM-DD'));
  return _.sortBy(
    Object.entries(grouped).map(([day, items]) => ({ day, count: items.length })),
    'day',
  ).slice(-14);
}

const PRIORITY_RANK: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export function compareTickets(key: SortKey): (a: Ticket, b: Ticket) => number {
  return (a, b) => {
    switch (key) {
      case 'createdAt':
        return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
      case 'priority':
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      case 'title':
        return a.title.localeCompare(b.title);
    }
  };
}
