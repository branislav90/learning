type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number; run: number }
  | { status: 'done' }
  | { status: 'failed'; message: string }
  | { status: 'cancelled' };

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
      // every non-active state can (re)start; run increments so the effect restarts
      return event.type === 'START'
        ? { status: 'uploading', progress: 0, run: nextRun(state) }
        : state;
    case 'uploading':
      switch (event.type) {
        case 'PROGRESS': return { ...state, progress: event.fraction };
        case 'LOADED':   return { status: 'done' };
        case 'FAILED':   return { status: 'failed', message: event.message };
        case 'CANCEL':   return { status: 'cancelled' };
        default:         return state;
      }
    default: { const n: never = state; return n; }
  }
}
// run counter lives in a module-level helper or in the state; simplest: keep `run` in a sibling useState or
// carry `lastRun` on the non-active states. Here we carry it via a tiny helper:
function nextRun(_: UploadState): number { return Date.now(); } // NOT pure! see note
export {};
