type UploadState =
  | { status: 'idle'; runs: number }
  | { status: 'uploading'; runs: number; progress: number }
  | { status: 'done'; runs: number }
  | { status: 'failed'; runs: number; message: string }
  | { status: 'cancelled'; runs: number };
// START: { status: 'uploading', runs: state.runs + 1, progress: 0 }
export {};
