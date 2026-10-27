import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Suspense } from 'react';
import { HttpError } from './http';

function ProductError({ error, resetErrorBoundary }: FallbackProps) {
  if (error instanceof HttpError && error.status === 404) {
    return <p role="alert">This product no longer exists.</p>; // no retry button: permanent
  }
  return (
    <div role="alert">
      <p>We couldn't load this product.</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Product({ id }: { id: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getJson<{ name: string }>(`/api/products/${id}`, signal),
  });
  return <h1>{data.name}</h1>;
}

export function ProductPanel({ id }: { id: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} resetKeys={[id]} FallbackComponent={ProductError}>
          <Suspense fallback={<p>Loading…</p>}>
            <Product id={id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
export {};
