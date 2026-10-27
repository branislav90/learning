// app/router.tsx
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RootError,                               // global fallback (lesson 19)
    children: [
      authRoutes,
      { loader: requireSession, Component: AuthedLayout,    // pathless layout route + guard (UX only)
        children: [ordersRoutes, settingsRoutes, dashboardRoutes] },
      { path: "*", Component: NotFound },
    ],
  },
]);
export {};
