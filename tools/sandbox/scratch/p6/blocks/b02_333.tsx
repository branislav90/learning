export async function fetchWithTimeout(
  url: string,
  userSignal: AbortSignal,
  ms = 8000,
): Promise<unknown> {
  const signal = AbortSignal.any([userSignal, AbortSignal.timeout(ms)]);
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new HttpError(res.status, res.statusText);
    return await res.json();
  } catch (e) {
    // Distinguish: caller cancelled (ignore) vs timeout (a failure we can retry)
    if (userSignal.aborted) throw userSignal.reason;       // propagate as cancellation
    if (e instanceof DOMException && e.name === 'TimeoutError') {
      throw new RequestTimeoutError(url, ms);
    }
    throw e;
  }
}
export {};
