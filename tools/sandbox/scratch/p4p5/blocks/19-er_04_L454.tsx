export class AppError extends Error {
  constructor(message: string, readonly kind: "not-found" | "forbidden" | "unauthenticated" | "contract" | "unknown", opts?: { cause?: unknown }) {
    super(message, opts);
    this.name = "AppError";
  }
}

export function PanelError({ error, onRetry }: { error: Error; onRetry(): void }) {
  const kind = error instanceof AppError ? error.kind : "unknown";
  switch (kind) {
    case "not-found":   return <EmptyPanel message="This item no longer exists." />;      // no retry: pointless
    case "forbidden":   return <EmptyPanel message="You don't have access to this panel." />;
    case "unauthenticated": return <SessionExpired />;                                    // route-level redirect better
    default:            return (
      <div role="alert">
        <p>Something went wrong in this panel.</p>
        <button onClick={onRetry}>Try again</button>
      </div>
    );
  }
}
export {};
