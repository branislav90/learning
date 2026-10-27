export function describe(e: Error): { title: string; action: 'retry' | 'signin' | 'none' } {
  if (e instanceof HttpError) {
    if (e.status === 401) return { title: 'Your session expired.', action: 'signin' };
    if (e.status === 403) return { title: "You don't have access to this.", action: 'none' };
    if (e.status === 404) return { title: "We couldn't find that.", action: 'none' };
    if (e.status === 429) return { title: 'Too many requests. Try again shortly.', action: 'retry' };
    if (e.status >= 500) return { title: 'Something went wrong on our side.', action: 'retry' };
    return { title: 'The request could not be completed.', action: 'none' };
  }
  if (e instanceof TypeError) return { title: "Can't reach the server. Check your connection.", action: 'retry' };
  return { title: 'Something went wrong.', action: 'none' };
}
export {};
