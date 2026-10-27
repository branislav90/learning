function useAsync<T>(load: (s: AbortSignal) => Promise<T>, opts: { enabled?: boolean } = {}) { … }
export {};
