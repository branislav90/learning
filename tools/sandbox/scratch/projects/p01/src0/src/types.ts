// src/types.ts
export type ReadingStatus = "want" | "reading" | "finished";
export type StatusFilter = ReadingStatus | "all";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Book {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly status: ReadingStatus;
  /** undefined means "not rated yet" */
  readonly rating?: Rating;
  readonly notes?: string;
}

export interface BookDraft {
  title: string;
  author: string;
  status: ReadingStatus;
  rating: Rating | undefined;
}

export interface BookStats {
  total: number;
  finished: number;
  ratedCount: number;
  /** null when there are no rated books (avoid NaN) */
  averageRating: number | null;
}
