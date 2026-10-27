export class AppError extends Error {
  constructor(
    message: string,
    readonly code: 'network' | 'unauthorized' | 'not_found' | 'server' | 'contract',
    options?: { cause?: unknown; retryable?: boolean },
  ) {
    super(message, { cause: options?.cause });   // ES2022 Error cause; needs lib es2022 in tsconfig
    this.name = 'AppError';
    this.retryable = options?.retryable ?? false;
  }
  readonly retryable: boolean;
}

export function toAppError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  if (e instanceof TypeError && /fetch|network/i.test(e.message)) {
    return new AppError('Network unreachable', 'network', { cause: e, retryable: true });
  }
  return new AppError('Unexpected error', 'server', { cause: e });
}

export function toUserMessage(e: unknown): string {
  const err = toAppError(e);
  switch (err.code) {
    case 'network':      return 'You appear to be offline. Check your connection and try again.';
    case 'unauthorized': return 'Your session has expired. Please sign in again.';
    case 'not_found':    return 'We could not find what you were looking for.';
    case 'contract':     // fallthrough: server returned something we cannot parse = bug
    case 'server':       return 'Something went wrong on our side. We have been notified.';
  }
}
export {};
