// features/comments/model/types.ts
export interface Comment { id: string; author: string; body: string; createdAt: string }
export interface CommentsViewModel {
  comments: readonly Comment[];
  authors: readonly string[];
  selectedAuthor: string | null;     // null = all authors
}
export {};
