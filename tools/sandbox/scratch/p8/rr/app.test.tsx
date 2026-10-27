import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { create } from "zustand";
import { createMemoryRouter, Navigate, Outlet, useLocation, Link } from "react-router";
import { RouterProvider } from "react-router/dom";
import { useEffect } from "react";

const useCartStore = create<{ items: string[]; add: (s: string) => void }>((set) => ({ items: [], add: (s) => set((st) => ({ items: [...st.items, s] })) }));
function RequireAuth() { const loc = useLocation(); const ok = !!localStorage.getItem("token"); return ok ? <Outlet /> : <Navigate to="/login" replace state={{ from: loc.pathname }} />; }
const routes = [{ path: "/", element: <Outlet />, children: [
  { index: true, element: <p>Welcome <Link to="/cart">go</Link></p> },
  { path: "login", lazy: async () => ({ Component: () => { const l = useLocation(); return <><title>Login</title><p>Login page from {String((l.state as any)?.from)}</p></>; } }) },
  { element: <RequireAuth />, children: [{ path: "cart", element: <p>Cart {useCartStore.getState().items.length}</p> }] },
] }];
test("guard redirect + lazy + title + reset store", async () => {
  useCartStore.getState().add("x");
  useCartStore.setState(useCartStore.getInitialState(), true);
  expect(useCartStore.getState().items).toEqual([]);
  expect(typeof useCartStore.getState().add).toBe("function");
  const router = createMemoryRouter(routes, { initialEntries: ["/cart"] });
  render(<RouterProvider router={router} />);
  expect(await screen.findByText(/Login page from \/cart/)).toBeInTheDocument();
  console.log("RESULT pathname:", router.state.location.pathname, "document.title:", JSON.stringify(document.title));
});
