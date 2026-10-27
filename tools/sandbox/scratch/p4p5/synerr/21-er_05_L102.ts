static getDerivedStateFromError(error: unknown): Partial<State>  // render phase: must be pure
componentDidCatch(error: unknown, info: React.ErrorInfo): void   // commit phase: side effects OK
export {};
