// INCORRECT: status is a string but transitions are unrestricted
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');

async function submit() {
  setStatus('loading');
  try { await save(); setStatus('success'); }
  catch { setStatus('error'); }
}
// Elsewhere, any code may call setStatus('success') — including while 'idle'.
export {};
