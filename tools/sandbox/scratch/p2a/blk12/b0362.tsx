import { useEffect, useId } from "react";

interface CommentData { id: string; text: string; postedAt: string } // ISO string from the server

export function Comment({ comment, onSeen }: { comment: CommentData; onSeen: (id: string) => void }) {
  const headingId = useId();                                          // stable, SSR-safe id
  const posted = new Date(comment.postedAt);                          // derived, deterministic from props
  const label = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(posted);

  useEffect(() => {
    onSeen(comment.id);                                               // after commit, when it is actually on screen
  }, [comment.id, onSeen]);

  return (
    <section aria-labelledby={headingId}>
      <h4 id={headingId}>Comment</h4>
      <time dateTime={comment.postedAt}>{label}</time>
      <p>{comment.text}</p>
    </section>
  );
}
