// 1) Error boundary wrapping: a class-based boundary (or a library's boundary) exposed as a HOC.
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  boundaryProps: Omit<ErrorBoundaryProps, "children">,
) {
  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...boundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  }
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName ?? Component.name})`;
  return WithErrorBoundary;
}

// 2) Instrumenting every component of a given kind without touching their source.
// 3) Applying cross-cutting wrappers in a plugin/registry that receives component *types*:
registry.register("orders-widget", withErrorBoundary(withTelemetry(OrdersWidget), { fallback: <WidgetCrash /> }));
export {};
