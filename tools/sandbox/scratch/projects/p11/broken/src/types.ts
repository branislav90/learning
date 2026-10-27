export type Status = 'open' | 'pending' | 'resolved';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type SortKey = 'createdAt' | 'priority' | 'title';

export interface Ticket {
  id: number;
  title: string;
  requester: string;
  status: Status;
  priority: Priority;
  createdAt: string; // ISO
  assignee: string | null;
}

export interface Comment {
  id: number;
  author: string;
  body: string;
  createdAt: string;
}

export interface TicketDetailData {
  id: number;
  description: string;
  comments: Comment[];
}

export interface Stats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  avgAgeDays: number;
}
