import { useOptimistic, useRef, useState, startTransition } from 'react';

interface Comment { clientKey: string; id?: string; text: string; pending?: boolean }

export function Comments({ postId, initial }: { postId: string; initial: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initial);          // base (confirmed) state
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (current: Comment[], draft: Comment) => [...current, { ...draft, pending: true }],
  );
  const [failed, setFailed] = useState<Array<{ clientKey: string; text: string }>>([]);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(formData: FormData) {
    const text = String(formData.get('text') ?? '').trim();
    if (text === '') return;

    const draft: Comment = { clientKey: crypto.randomUUID(), text };
    addOptimisticComment(draft);                                          // inside the Action
    formRef.current?.reset();

    try {
      const saved = await api.createComment(postId, { text, idempotencyKey: draft.clientKey });
      startTransition(() => {                                             // post-await update kept in the transition ⚠ verify rule
        setComments((c) => [...c, { clientKey: draft.clientKey, id: saved.id, text: saved.text }]);
      });
    } catch (e) {
      // Overlay will be dropped when the Action ends; surface the failure and keep the text.
      startTransition(() => setFailed((f) => [...f, { clientKey: draft.clientKey, text }]));
    }
  }

  return (
    <>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.clientKey} aria-busy={c.pending} style={{ opacity: c.pending ? 0.6 : 1 }}>
            {c.text}{c.pending && <span className="sr-only"> (sending)</span>}
          </li>
        ))}
      </ul>
      {failed.map((f) => (
        <p key={f.clientKey} role="alert">
          Not posted: “{f.text}”{' '}
          <button type="button" onClick={() => setFailed((x) => x.filter((y) => y.clientKey !== f.clientKey))}>Discard</button>
        </p>
      ))}
      <form action={submit} ref={formRef}>
        <textarea name="text" required />
        <button type="submit">Post</button>
      </form>
    </>
  );
}
declare const api: { createComment(postId: string, body: { text: string; idempotencyKey: string }): Promise<{ id: string; text: string }>; setLike(id: string, v: boolean): Promise<void> };
export {};
