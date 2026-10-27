// SubmitButton.tsx
import { useActorRef, useSelector } from '@xstate/react';
import { submitMachine, type OrderInput } from './submitMachine';

export function SubmitOrder({ order }: { order: OrderInput }) {
  const actorRef = useActorRef(submitMachine, { input: { order } });
  const canSubmit = useSelector(actorRef, (s) => s.can({ type: 'SUBMIT' }));
  const submitting = useSelector(actorRef, (s) => s.matches('submitting'));
  const error = useSelector(actorRef, (s) => s.context.error);
  const done = useSelector(actorRef, (s) => s.matches('success'));

  if (done) return <p role="status">Order placed.</p>;
  return (
    <div>
      <button disabled={!canSubmit} onClick={() => actorRef.send({ type: 'SUBMIT' })}>
        {submitting ? 'Placing order…' : 'Place order'}
      </button>
      {submitting && <button onClick={() => actorRef.send({ type: 'CANCEL' })}>Cancel</button>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export {};
