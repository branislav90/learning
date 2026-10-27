// features/comments/ui/CommentListView.tsx — presentational: props only, no data hooks
import type { Comment } from "../model/types";

interface Props {
  comments: readonly Comment[];
  authors: readonly string[];
  selectedAuthor: string | null;
  onAuthorChange: (author: string | null) => void;
}

export function CommentListView({ comments, authors, selectedAuthor, onAuthorChange }: Props) {
  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading">Comments ({comments.length})</h2>
      <label>
        Author{" "}
        <select value={selectedAuthor ?? ""} onChange={(e) => onAuthorChange(e.target.value || null)}>
          <option value="">All</option>
          {authors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>{comments.map((c) => <li key={c.id}><strong>{c.author}</strong>: {c.body}</li>)}</ul>
      )}
    </section>
  );
}
export {};
