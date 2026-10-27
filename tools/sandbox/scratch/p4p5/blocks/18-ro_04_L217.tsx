// app/router.tsx  (verify-against-docs: package names and API differ between React Router v6/v7)
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router";

function Shell() {
  return (
    <>
      <nav><Link to="/">Home</Link> <Link to="/orders">Orders</Link></nav>
      <main><Outlet /></main>          {/* where matched child routes render */}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Shell,                  // layout route (verify: element vs Component prop naming)
    children: [
      { index: true, Component: Home },
      { path: "orders", Component: OrdersLayout, children: [
        { index: true, Component: OrdersList },
        { path: ":orderId", Component: OrderDetail },
      ]},
      { path: "*", Component: NotFound },
    ],
  },
]);

export function App() { return <RouterProvider router={router} />; }
export {};
