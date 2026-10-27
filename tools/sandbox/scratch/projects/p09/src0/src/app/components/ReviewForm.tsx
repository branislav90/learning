// src/app/components/ReviewForm.tsx
'use client'; // marker only; harmless in a non-RSC app, documents the intent
import { useId, useOptimistic, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

function Submit() {
  const { pending } = useFormStatus();           // must be rendered INSIDE the <form>
  return <button type="submit" disabled={pending}>{pending ? 'Posting…' : 'Post review'}</button>;
}

export function ReviewForm({ slug }: { slug: string }) {
  const id = useId();                             // hydration-safe ids
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState<string[]>([]);
  const [optimistic, addOptimistic] = useOptimistic(posted, (cur, body: string) => [...cur, body]);
  const [, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();                           // only runs when JS is present
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      addOptimistic(String(data.get('body')));
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { 'x-enhanced': '1' } });
      if (!res.ok) { setError('Could not post. Try again.'); return; }
      setError(null);
      setPosted((p) => [...p, String(data.get('body'))]);
      form.reset();
    });
  }

  return (
    <form method="post" action={`/products/${slug}/reviews`} onSubmit={onSubmit} aria-describedby={error ? `${id}-err` : undefined}>
      <label htmlFor={`${id}-body`}>Your review</label>
      <textarea id={`${id}-body`} name="body" required minLength={10} />
      <label htmlFor={`${id}-rating`}>Rating</label>
      <select id={`${id}-rating`} name="rating" defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}</select>
      <Submit />
      {error && <p id={`${id}-err`} role="alert">{error}</p>}
      <ul aria-live="polite">{optimistic.map((b, i) => <li key={i}>{b} (pending)</li>)}</ul>
    </form>
  );
}
