type Fetcher = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
type Middleware = (next: Fetcher) => Fetcher;

const withAuth = (getToken: () => string): Middleware => (next) => (input, init) =>
  next(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${getToken()}` } });

const withRetry = (times: number): Middleware => (next) => async (input, init) => {
  let lastError: unknown;
  for (let i = 0; i <= times; i++) {
    try {
      const res = await next(input, init);
      if (res.status < 500) return res;
      lastError = new Error(String(res.status));
    } catch (e) { lastError = e; }
  }
  throw lastError;
};

const compose = (...ms: Middleware[]): Middleware => (next) => ms.reduceRight((f, m) => m(f), next);

export const apiFetch: Fetcher = compose(withAuth(() => "token"), withRetry(2))(fetch);
export {};
