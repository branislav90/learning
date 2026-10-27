let renders = 0;                                         // (1) module state

export function Comment({ comment, onSeen }: { comment: { id: string; text: string; seen: boolean }; onSeen: (id: string) => void }) {
  renders++;                                             // (1)
  const id = `c-${Math.random().toString(36).slice(2)}`; // (2) non-deterministic id
  const stamp = new Date().toLocaleTimeString();         // (3) time in render
  comment.seen = true;                                   // (4) mutate prop
  onSeen(comment.id);                                    // (5) call parent callback (may set state) in render
  return (
    <section id={id}>
      <time>{stamp}</time>
      <p>{comment.text}</p>
    </section>
  );
}
