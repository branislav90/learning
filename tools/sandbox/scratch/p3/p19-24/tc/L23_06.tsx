export {};
// ✅
type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; error: Error } | { kind: 'success'; data: Data };
const [status, setStatus] = useState<Status>({ kind: 'idle' });
