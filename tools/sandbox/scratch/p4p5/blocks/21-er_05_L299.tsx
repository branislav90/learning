import { useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

type SaveResult =
  | { ok: true }
  | { ok: false; kind: 'conflict'; message: string }   // expected: user must reload/merge
  | { ok: false; kind: 'validation'; fields: Record<string, string> };

function SaveButton({ doc }: { doc: Doc }) {
  const { showBoundary } = useErrorBoundary();
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setProblem(null);
    try {
      const result = await saveDocument(doc);   // returns SaveResult, throws only for the unexpected
      if (!result.ok) {
        setProblem(result.kind === 'conflict' ? result.message : 'Please fix the highlighted fields.');
      }
    } catch (error) {
      showBoundary(error);                       // unexpected → boundary
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button type="button" onClick={onClick} disabled={pending}>
        {pending ? 'Saving…' : 'Save'}
      </button>
      {problem && <p role="alert">{problem}</p>}
    </>
  );
}
export {};
