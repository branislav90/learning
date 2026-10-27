import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

function WidgetFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = toUserMessage(error);
  return (
    <div role="alert" className="widget-error">
      <p>{message}</p>
      <button type="button" onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function Widget({ children, widgetId }: { children: React.ReactNode; widgetId: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={WidgetFallback}
          onReset={reset}                       // tell TanStack Query to forget its error state
          onError={(error, info) => reportError(error, { widgetId, componentStack: info.componentStack })}
          resetKeys={[widgetId]}                // new widget id → auto reset
        >
          <Suspense fallback={<Skeleton />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
export {};
