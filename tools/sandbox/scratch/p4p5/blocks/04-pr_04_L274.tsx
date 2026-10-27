// features/comments/ui/CommentList.tsx — container: data-aware, no visual detail
import { useComments } from "../model/useComments";
import { CommentListView } from "./CommentListView";

export function CommentList({ postId }: { postId: string }) {
  const { status, comments, authors, selectedAuthor, setSelectedAuthor } = useComments(postId);
  if (status === "loading") return <p aria-busy="true">Loading comments…</p>;
  if (status === "error") return <p role="alert">Could not load comments.</p>;
  return (
    <CommentListView
      comments={comments}
      authors={authors}
      selectedAuthor={selectedAuthor}
      onAuthorChange={setSelectedAuthor}
    />
  );
}
export {};
