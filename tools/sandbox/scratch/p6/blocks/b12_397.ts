type S =
  | { status: 'idle' }
  | { status: 'submitting'; attempts: number }
  | { status: 'failure'; attempts: number; error: string }
  | { status: 'success'; orderId: string };
type E = { type: 'SUBMIT' } | { type: 'RETRY' } | { type: 'FAIL'; error: string } | { type: 'OK'; id: string };

function reduce(s: S, e: E): S {
  switch (s.status) {
    case 'idle': return e.type === 'SUBMIT' ? { status: 'submitting', attempts: 1 } : s;
    case 'submitting':
      if (e.type === 'FAIL') return { status: 'failure', attempts: s.attempts, error: e.error };
      if (e.type === 'OK') return { status: 'success', orderId: e.id };
      return s;                                   // everything else ignored
    case 'failure':
      return e.type === 'RETRY' && s.attempts < 3 ? { status: 'submitting', attempts: s.attempts + 1 } : s;
    case 'success': return s;
  }
}
export {};
