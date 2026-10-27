import { test, vi } from "vitest";
import { render } from "@testing-library/react";
import { createMemoryRouter, Navigate, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
const mk = (routes: any, entry: string) => createMemoryRouter(routes, { initialEntries: [entry] });
test("variants", async () => {
  const variants: Record<string, any> = {
    "flat navigate": [{ path: "/cart", element: <Navigate to="/login" replace /> }, { path: "/login", element: <p>Login</p> }],
    "nested root outlet": [{ path: "/", element: <Outlet />, children: [{ path: "cart", element: <Navigate to="/login" replace /> }, { path: "login", element: <p>Login</p> }] }],
    "pathless guard": [{ path: "/", element: <Outlet />, children: [{ element: <Outlet />, children: [{ path: "cart", element: <Navigate to="/login" replace /> }] }, { path: "login", element: <p>Login</p> }] }],
    "lazy login": [{ path: "/cart", element: <Navigate to="/login" replace /> }, { path: "/login", lazy: async () => ({ Component: () => <p>Login</p> }) }],
    "lazy login w/ state": [{ path: "/cart", element: <Navigate to="/login" replace state={{ a: 1 }} /> }, { path: "/login", lazy: async () => ({ Component: () => <p>LoginL</p> }) }],
  };
  for (const [name, routes] of Object.entries(variants)) {
    const router = mk(routes, "/cart");
    const { container, unmount } = render(<RouterProvider router={router} />);
    await new Promise(r => setTimeout(r, 150));
    console.log("RESULT", name, "=>", container.innerHTML, router.state.location.pathname);
    unmount();
  }
});
