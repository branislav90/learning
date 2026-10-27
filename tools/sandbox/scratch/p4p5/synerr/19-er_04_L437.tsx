// Layering
<RootBoundary>                       {/* last resort: whole app; fallback = RootErrorScreen */}
  <RouterProvider router={router} /> {/* route error elements: per layout (lesson 18) */}
</RootBoundary>

// Inside a dashboard route: independent widgets
<Dashboard>
  <WidgetFrame title="Revenue"><RevenueChart /></WidgetFrame>   {/* WidgetFrame = Boundary + Suspense + skeleton */}
  <WidgetFrame title="Recent orders"><RecentOrders /></WidgetFrame>
</Dashboard>
export {};
