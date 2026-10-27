type UploadState =
  | { status: 'idle'; runs: number }
  | { status: 'uploading'; runs: number; progress: number }
  | { status: 'done'; runs: number }
  | { status: 'failed'; runs: number; message: string }
  | { status: 'cancelled'; runs: number };

type UploadEvent =
  | { type: 'START' }
  | { type: 'PROGRESS'; fraction: number }
  | { type: 'LOADED' }
  | { type: 'FAILED'; message: string }
  | { type: 'CANCEL' };

function uploadReducer(state: UploadState, event: UploadEvent): UploadState {
  switch (state.status) {
    case 'idle':
    case 'done':
    case 'failed':
    case 'cancelled':
      // Every non-active state can (re)start. `runs` is a counter carried in the state,
      // so each start has a distinct identity the effect can key on.
      return event.type === 'START'
        ? { status: 'uploading', runs: state.runs + 1, progress: 0 }
        : state;
    case 'uploading':
      switch (event.type) {
        case 'PROGRESS': return { ...state, progress: event.fraction };
        case 'LOADED':   return { status: 'done', runs: state.runs };
        case 'FAILED':   return { status: 'failed', runs: state.runs, message: event.message };
        case 'CANCEL':   return { status: 'cancelled', runs: state.runs };
        default:         return state;
      }
    default: { const n: never = state; return n; }
  }
}
export {};
