import { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary'; // class component or react-error-boundary ⚠ verify API

export function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="grid">
        <Widget title="Revenue">
          <ErrorBoundary fallback={<WidgetError name="Revenue" />}>
            <Suspense fallback={<WidgetSkeleton />}>
              <RevenueChart />   {/* reads data with use()/a Suspense-enabled library */}
            </Suspense>
          </ErrorBoundary>
        </Widget>

        <Widget title="Orders">
          <ErrorBoundary fallback={<WidgetError name="Orders" />}>
            <Suspense fallback={<WidgetSkeleton />}>
              <OrdersTable />
            </Suspense>
          </ErrorBoundary>
        </Widget>
      </div>
    </main>
  );
}
export {};
