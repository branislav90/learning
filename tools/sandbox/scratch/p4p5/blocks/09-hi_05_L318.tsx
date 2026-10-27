// utility; reads right-to-left like function composition
const compose = <T,>(...fns: Array<(x: T) => T>) => (x: T) => fns.reduceRight((acc, f) => f(acc), x);

const enhance = compose(
  withErrorBoundary,     // outermost
  withRequiredRole("admin"),
  withWindowSize,        // innermost: closest to the component
);
export const AdminDashboard = enhance(DashboardBase);
export {};
